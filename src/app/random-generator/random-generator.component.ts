import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-random-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatCardModule, MatSnackBarModule],
  template: `
    <mat-card class="vibrant-card">
      <mat-card-header>
        <mat-card-title>Generador de Número Aleatorio</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="randomForm" (ngSubmit)="generateRandom()">
          <mat-form-field>
            <input matInput type="number" formControlName="min" placeholder="Mínimo">
            <mat-error *ngIf="randomForm.get('min')?.hasError('required')">El mínimo es requerido</mat-error>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="number" formControlName="max" placeholder="Máximo">
            <mat-error *ngIf="randomForm.get('max')?.hasError('required')">El máximo es requerido</mat-error>
          </mat-form-field>
          <button mat-raised-button type="submit" [disabled]="!randomForm.valid">Generar</button>
        </form>
        <div class="random-number-display" *ngIf="randomNumber !== null" [@numberAnimation]="'in'">
          {{ randomNumber }}
        </div>
        <p>Historial de números generados:</p>
        <ul>
          <li *ngFor="let number of generatedNumbers">{{number}}</li>
        </ul>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-form-field {
      margin-right: 10px;
    }
    ul {
      max-height: 150px;
      overflow-y: auto;
    }
    .random-number-display {
      font-size: 72px;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
      color: #4a148c;
    }
  `],
  animations: [
    trigger('numberAnimation', [
      state('in', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.1)'
        }),
        animate('0.5s ease-out')
      ])
    ])
  ]
})
export class RandomGeneratorComponent {
  randomForm: FormGroup;
  randomNumber: number = 0;
  generatedNumbers: number[] = [];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.randomForm = this.fb.group({
      min: [0, [Validators.required, Validators.min(-1000000), Validators.max(1000000)]],
      max: [100, [Validators.required, Validators.min(-1000000), Validators.max(1000000)]]
    }, { validator: this.minMaxValidator });
  }

  minMaxValidator(group: FormGroup) {
    const min = group.get('min')?.value;
    const max = group.get('max')?.value;
    return min < max ? null : { minGreaterThanMax: true };
  }

  generateRandom() {
    if (this.randomForm.valid) {
      const min = this.randomForm.get('min')?.value;
      const max = this.randomForm.get('max')?.value;
      
      if (min >= max) {
        this.showError('El mínimo debe ser menor que el máximo');
        return;
      }

      this.randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      this.generatedNumbers.unshift(this.randomNumber);
      
      // Keep only the last 10 generated numbers
      if (this.generatedNumbers.length > 10) {
        this.generatedNumbers.pop();
      }
    } else {
      this.showError('Por favor, corrija los errores en el formulario');
    }
  }

  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
