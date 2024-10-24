import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatCardModule, MatSnackBarModule, MatListModule],
  template: `
    <mat-card class="vibrant-card">
      <mat-card-header>
        <mat-card-title>Calculadora</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field>
          <input matInput [(ngModel)]="display" readonly>
        </mat-form-field>
        <div class="calculator-buttons">
          <button mat-raised-button 
                  *ngFor="let btn of buttons" 
                  (click)="pressButton(btn)"
                  [@buttonPress]="pressedButton === btn ? 'pressed' : 'released'"
                  class="calculator-button">
            {{btn}}
          </button>
        </div>
        <div class="history-section">
          <h3>Historial de operaciones</h3>
          <mat-list [@listAnimation]="history.length">
            <mat-list-item *ngFor="let item of history; let i = index" [@itemAnimation]="i">
              {{ item.expression }} = {{ item.result }}
            </mat-list-item>
          </mat-list>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .calculator-buttons {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    mat-form-field {
      width: 100%;
    }
    .history-section {
      margin-top: 20px;
      max-height: 400px;
      overflow-y: auto;
    }
    .calculator-button {
      min-height: 48px;
    }
  `],
  animations: [
    trigger('buttonPress', [
      state('released', style({
        transform: 'scale(1)',
        backgroundColor: '*'
      })),
      state('pressed', style({
        transform: 'scale(0.95)',
        backgroundColor: '#ad1457'
      })),
      transition('released => pressed', animate('100ms ease-in')),
      transition('pressed => released', animate('100ms ease-out'))
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          stagger('50ms', animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-15px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CalculatorComponent {
  display = '';
  buttons = ['7', '8', '9', '/', 'C', '4', '5', '6', '*', '←', '1', '2', '3', '-', '√', '0', '.', '=', '+', '^', '(', ')', 'sin', 'cos', 'tan'];
  history: { expression: string, result: string }[] = [];
  pressedButton: string | null = null;

  constructor(private snackBar: MatSnackBar) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    
    if (key === 'Enter') {
      this.pressButton('=');
      event.preventDefault();
    } else if (key === 'Backspace') {
      this.pressButton('←');
      event.preventDefault();
    } else if (key === 'Escape') {
      this.pressButton('C');
      event.preventDefault();
    } else if (/[\d\+\-\*\/\.\(\)]/.test(key)) {
      this.pressButton(key);
      event.preventDefault();
    }
  }

  pressButton(btn: string) {
    this.pressedButton = btn;
    setTimeout(() => this.pressedButton = null, 100);

    if (btn === '=') {
      try {
        const result = this.evaluateExpression(this.display);
        this.history.unshift({ expression: this.display, result: result });
        this.display = result;
        if (this.history.length > 10) {
          this.history.pop();
        }
      } catch (e) {
        this.showError('Error en la expresión');
        this.display = 'Error';
      }
    } else if (btn === 'C') {
      this.display = '';
    } else if (btn === '←') {
      this.display = this.display.slice(0, -1);
    } else if (btn === '√') {
      try {
        const value = this.evaluateExpression(this.display);
        const numValue = parseFloat(value);
        if (numValue < 0) {
          this.showError('No se puede calcular la raíz cuadrada de un número negativo');
        } else {
          this.display = Math.sqrt(numValue).toString();
        }
      } catch (e) {
        this.showError('Error al calcular la raíz cuadrada');
      }
    } else if (['sin', 'cos', 'tan'].includes(btn)) {
      this.display += `${btn}(`;
    } else {
      this.display += btn;
    }
  }

  evaluateExpression(expr: string): string {
    expr = expr.replace(/\^/g, '**');
    expr = expr.replace(/sin\(/g, 'Math.sin(');
    expr = expr.replace(/cos\(/g, 'Math.cos(');
    expr = expr.replace(/tan\(/g, 'Math.tan(');
    
    try {
      const fn = new Function('return ' + expr);
      const result = fn();
      
      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid result');
      }
      
      return result.toString();
    } catch (e) {
      throw new Error('Invalid expression');
    }
  }

  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
