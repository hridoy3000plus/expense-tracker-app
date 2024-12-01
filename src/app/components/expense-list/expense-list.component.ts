import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Expense } from 'src/app/models/expense.model';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
})
export class ExpenseListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() expenses: Expense[] = [];
  @Output() expenseDeleted = new EventEmitter<string>();

  deleteExpense(id: string) {
    this.expenseDeleted.emit(id);
  }
}
