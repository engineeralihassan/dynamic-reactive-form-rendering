import { Component } from '@angular/core';
import { FormField } from '../../models/form-field.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../text-input/text-input.component';
import { RadioComponent } from '../radio/radio.component';
import { SelectBoxComponent } from '../select-box/select-box.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
    RadioComponent,
    SelectBoxComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  formFields: FormField[] = [
    new FormField(
      'First Name',
      'firstname',
      'First Name',
      'text',
      [],
      true,
      2,
      10,
      [],
      'firstname',
      ['required', 'minLength']
    ),
    new FormField(
      'Gender',
      'gender',
      'Gender',
      'select',
      ['Male', 'Female', 'Other'],
      true,
      2,
      10,
      [],
      'gender',
      ['required']
    ),
    new FormField(
      'Last Name',
      'lastname',
      'Last Name',
      'text',
      [],
      true,
      2,
      10,
      [],
      'lastname',
      ['required', 'minLength']
    ),
    new FormField(
      'Password',
      'password',
      'Password',
      'password',
      [],
      true,
      8,
      null,
      [],
      'password',
      ['required']
    ),
  ];

  dynamicForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.dynamicForm = this.createForm(this.formFields);
  }

  createForm(fields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};
    fields.forEach((field) => {
      const validators = this.makeValidators(field);
      group[field.key] = this.fb.control('', validators);
    });
    return this.fb.group(group);
  }

  makeValidators(field: FormField): ValidatorFn[] {
    const validators: any = [];

    if (field.required) {
      validators.push(Validators.required);
    }
    if (!!field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }
    if (!!field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }

    return validators;
  }

  onSubmit() {
    console.log(this.dynamicForm.value);
    alert('Form Submitted Successfully😘');
  }
  private componentMap: Record<string, any> = {
    text: TextInputComponent,
    password: TextInputComponent,
    select: SelectBoxComponent,
    radio: RadioComponent,
  };
  resolveComponent(type: string): any {
    return this.componentMap[type] || null;
  }
}
