import { Component, Input } from '@angular/core';
import { FormField } from '../../models/form-field.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-select-box',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './select-box.component.html',
  styleUrl: './select-box.component.scss',
})
export class SelectBoxComponent {
  @Input() field!: FormField;
  @Input() formControl!: FormControl;
}
