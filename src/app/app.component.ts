import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CalculatorComponent } from './calculator/calculator.component';
import { RandomGeneratorComponent } from './random-generator/random-generator.component';
import { GraphingCalculatorComponent } from './graphing-calculator/graphing-calculator.component';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    CalculatorComponent,
    RandomGeneratorComponent,
    GraphingCalculatorComponent
  ],
  template: `
    <mat-toolbar color="primary" [@toolbarAnimation]="true">
      <button mat-icon-button (click)="drawer.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="toolbar-spacer"></span>
      <span>Proyecto Precalculo</span>
      <span class="toolbar-spacer"></span>
    </mat-toolbar>
    <mat-drawer-container class="app-container" autosize>
      <mat-drawer #drawer class="sidenav" mode="over" [@drawerAnimation]="drawer.opened ? 'open' : 'closed'">
        <mat-nav-list>
          <a mat-list-item (click)="setCurrentComponent('calculator'); drawer.close()" [@listAnimation]="true">
            <mat-icon>calculate</mat-icon>
            <span class="nav-caption">Calculadora</span>
          </a>
          <a mat-list-item (click)="setCurrentComponent('random'); drawer.close()" [@listAnimation]="true">
            <mat-icon>casino</mat-icon>
            <span class="nav-caption">Generador Aleatorio</span>
          </a>
          <a mat-list-item (click)="setCurrentComponent('graphing'); drawer.close()" [@listAnimation]="true">
            <mat-icon>show_chart</mat-icon>
            <span class="nav-caption">Graficadora</span>
          </a>
        </mat-nav-list>
      </mat-drawer>
      <mat-drawer-content>
        <div class="content" [@contentAnimation]="currentComponent">
          <app-calculator *ngIf="currentComponent === 'calculator'" [@componentAnimation]="true"></app-calculator>
          <app-random-generator *ngIf="currentComponent === 'random'" [@componentAnimation]="true"></app-random-generator>
          <app-graphing-calculator *ngIf="currentComponent === 'graphing'" [@componentAnimation]="true"></app-graphing-calculator>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [`
    .app-container {
      height: calc(100vh - 64px);
    }
    .sidenav {
      width: 250px;
    }
    .content {
      padding: 20px;
    }
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .nav-caption {
      margin-left: 8px;
    }
  `],
  animations: [
    trigger('drawerAnimation', [
      state('closed', style({
        transform: 'translateX(-100%)',
        visibility: 'hidden'
      })),
      state('open', style({
        transform: 'translateX(0)',
        visibility: 'visible'
      })),
      transition('closed <=> open', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('toolbarAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('componentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('contentAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AppComponent {
  currentComponent: 'calculator' | 'random' | 'graphing' = 'calculator';

  setCurrentComponent(component: 'calculator' | 'random' | 'graphing') {
    this.currentComponent = component;
  }
}
