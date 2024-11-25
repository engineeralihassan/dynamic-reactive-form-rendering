import { Component, Input } from '@angular/core';
import { FormField } from '../../models/form-field.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-box',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './select-box.component.html',
  styleUrl: './select-box.component.scss',
})
export class SelectBoxComponent {
  @Input() field!: FormField;
}
