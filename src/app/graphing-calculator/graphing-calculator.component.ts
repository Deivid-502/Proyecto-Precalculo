import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {CommonModule, getNumberOfCurrencyDigits} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-graphing-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="vibrant-card" [@cardAnimation]="true">
      <mat-card-header>
        <mat-card-title>Graficadora de Funciones</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="graphForm" (ngSubmit)="plotFunction()" [@formAnimation]="true">
          <mat-form-field class="full-width">
            <input matInput formControlName="function" placeholder="Función (ejemplo: x^2, sin(x), etc.)">
            <mat-error *ngIf="graphForm.get('function')?.hasError('required')">
              La función es requerida
            </mat-error>
          </mat-form-field>
          
          <div class="range-inputs">
            <mat-form-field>
              <input matInput type="number" formControlName="xMin" placeholder="X Mínimo">
            </mat-form-field>
            <mat-form-field>
              <input matInput type="number" formControlName="xMax" placeholder="X Máximo">
            </mat-form-field>
          </div>

          <mat-form-field>
            <mat-select formControlName="color" placeholder="Color de la gráfica">
              <mat-option value="#6a1b9a">Morado</mat-option>
              <mat-option value="#00796b">Verde Azulado</mat-option>
              <mat-option value="#ad1457">Rosa</mat-option>
              <mat-option value="#e65100">Naranja</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button type="submit" [disabled]="!graphForm.valid">
            Graficar Función
          </button>
        </form>

        <div class="canvas-container" [@canvasAnimation]="true">
          <canvas #graphCanvas></canvas>
          <div class="quadrant-labels">
            <span class="quadrant q1">I</span>
            <span class="quadrant q2">II</span>
            <span class="quadrant q3">III</span>
            <span class="quadrant q4">IV</span>
          </div>
        </div>

        <div class="function-examples" [@examplesAnimation]="true">
          <h3>Ejemplos de funciones:</h3>
          <ul>
            <li>Cuadrática: x^2</li>
            <li>Trigonométrica: sin(x)</li>
            <li>Exponencial: 2^x</li>
            <li>Logarítmica: log(x)</li>
            <li>Combinada: sin(x) * x^2</li>
          </ul>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    .range-inputs {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }
    .canvas-container {
      position: relative;
      width: 100%;
      height: 400px;
      margin: 20px 0;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      overflow: hidden;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
    .quadrant-labels {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .quadrant {
      position: absolute;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.2rem;
      font-weight: bold;
      padding: 8px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .q1 {
      top: 10px;
      right: 10px;
    }
    .q2 {
      top: 10px;
      left: 10px;
    }
    .q3 {
      bottom: 10px;
      left: 10px;
    }
    .q4 {
      bottom: 10px;
      right: 10px;
    }
    .function-examples {
      margin-top: 20px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin: 8px 0;
      padding: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    li:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(10px);
    }
  `],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('canvasAnimation', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, height: '400px' }))
      ])
    ]),
    trigger('examplesAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class GraphingCalculatorComponent implements OnInit, AfterViewInit {
  @ViewChild('graphCanvas') graphCanvas!: ElementRef<HTMLCanvasElement>;
  graphForm: FormGroup;
  ctx!: CanvasRenderingContext2D;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.graphForm = this.fb.group({
      function: ['x^2', [Validators.required]],
      xMin: [-10],
      xMax: [10],
      color: ['#6a1b9a']
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initCanvas();
    this.plotFunction();
  }

  initCanvas() {
    const canvas = this.graphCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    this.ctx.translate(canvas.width / 2, canvas.height / 2);
    this.ctx.scale(1, -1);
  }

  plotFunction() {
    if (this.graphForm.valid) {
      const canvas = this.graphCanvas.nativeElement;
      const ctx = this.ctx;
      
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      this.drawAxes();
      
      const func = this.graphForm.get('function')?.value;
      const xMin = this.graphForm.get('xMin')?.value;
      const xMax = this.graphForm.get('xMax')?.value;
      const color = this.graphForm.get('color')?.value;
      
      try {
        const f = new Function('x', `return ${func.replace(/\^/g, '**')}`);
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        const scale = 30;
        
        for (let px = -canvas.width / 2; px < canvas.width / 2; px++) {
          const x = px / scale;
          if (x < xMin || x > xMax) continue;
          
          try {
            const y = f(x);
            if (isNaN(y) || !isFinite(y)) continue;
            
            if (px === -canvas.width / 2) {
              ctx.moveTo(px, y * scale);
            } else {
              ctx.lineTo(px, y * scale);
            }
          } catch (e) {
            continue;
          }
        }
        
        ctx.stroke();
      } catch (e) {
        this.showError('Error al evaluar la función');
      }
    }
  }

  drawAxes() {
    const canvas = this.graphCanvas.nativeElement;
    const ctx = this.ctx;
    const scale = 30;
    
    // Dibujar líneas de la cuadrícula
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let x = -canvas.width / 2; x < canvas.width / 2; x += scale) {
      ctx.moveTo(x, -canvas.height / 2);
      ctx.lineTo(x, canvas.height / 2);
    }
    
    for (let y = -canvas.height / 2; y < canvas.height / 2; y += scale) {
      ctx.moveTo(-canvas.width / 2, y);
      ctx.lineTo(canvas.width / 2, y);
    }
    ctx.stroke();

    // Dibujar ejes principales
    ctx.beginPath();
    ctx.strokeStyle = '#ad1457'; // Eje X en rosa
    ctx.lineWidth = 2;
    ctx.moveTo(-canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#00796b'; // Eje Y en verde azulado
    ctx.lineWidth = 2;
    ctx.moveTo(0, -canvas.height / 2);
    ctx.lineTo(0, canvas.height / 2);
    ctx.stroke();

    // Dibujar marcas en los ejes
    ctx.save();
    ctx.scale(1, -1); // Invertir el eje Y para escribir texto
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Marcas en el eje X
    for (let x = -10; x <= 10; x++) {
      if (x === 0) continue;
      const xPos = x * scale;
      ctx.fillText(x.toString(), xPos, 5);
    }

    // Marcas en el eje Y
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = -10; y <= 10; y++) {
      if (y === 0) continue;
      const yPos = -y * scale; // Negativo porque el eje Y está invertido
      ctx.fillText(y.toString(), -5, yPos);
    }

    // Origen (0,0)
    ctx.fillStyle = '#e65100'; // Naranja para el origen
    ctx.textAlign = 'right';
    ctx.fillText('0', -5, 15);

    ctx.restore();
  }

  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
