import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ExpenseStorageService } from 'src/app/expense-storage.service';
import { Expense } from 'src/app/models/expense.model';
import { futureDateValidator } from 'src/app/validators/futureValidator';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
})
export class ExpenseFormComponent implements OnChanges {
  ngOnInit(): void {}

  @Input() editingExpense: Expense | null = null;
  @Output() expenseAdded = new EventEmitter<Expense>();
  @Output() expenseEdited = new EventEmitter<Expense>();

  expenseForm: FormGroup;
  isEditing = false;
  categories: any[];

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value); // Get the value as a Date object
      const currentDate = new Date(); // Get the current date

      // Set the time of the current date to 00:00:00 so only the date is considered
      currentDate.setHours(0, 0, 0, 0);

      // Check if the selected date is in the future
      if (selectedDate > currentDate) {
        return { futureDate: true }; // Return an error if the date is in the future
      }

      return null; // Return null if valid (i.e., not in the future)
    };
  }

  constructor(
    private fb: FormBuilder,
    private expenseStorage: ExpenseStorageService
  ) {
    this.categories = this.expenseStorage.getCategories();
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [this.formatDate(new Date()), [Validators.required, futureDateValidator()]],
      category: ['', Validators.required],
      description: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingExpense'] && this.editingExpense) {
      this.isEditing = true;
      this.expenseForm.patchValue({
        amount: this.editingExpense.amount,
        date: this.formatDate(this.editingExpense.date),
        category: this.editingExpense.category,
        description: this.editingExpense.description || ''
      });
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expenseData = {
        ...this.expenseForm.value,
        date: new Date(this.expenseForm.value.date)
      };

      try {
        if (this.isEditing && this.editingExpense) {
          const editedExpense: Expense = {
            ...expenseData,
            id: this.editingExpense.id
          };
          this.expenseEdited.emit(editedExpense);
        } else {
          const newExpense: Expense = {
            id: '',
            ...expenseData
          };
          this.expenseAdded.emit(newExpense);
        }

        this.expenseForm.reset({
          date: this.formatDate(new Date())
        });
        this.isEditing = false;
      } catch (error) {
        // TODO: Add proper error handling
        console.error('Error saving expense:', error);
      }
    }
  }

  cancelEdit() {
    this.expenseForm.reset({
      date: this.formatDate(new Date())
    });
    this.isEditing = false;
  }
}
