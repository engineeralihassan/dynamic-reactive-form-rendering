import { Component, ViewChild, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormField } from '../../models/form-field.model';
import { TextInputComponent } from '../text-input/text-input.component';
import { RadioComponent } from '../radio/radio.component';
import { SelectBoxComponent } from '../select-box/select-box.component';
import { ComponentHostDirective } from '../../directives/component-host.directive';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentHostDirective],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
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
      []
    ),
    new FormField(
      'Age',
      'age',
      'Age',
      'number',
      [],
      true,
      2,
      10,
      [],
      'age',
      []
    ),
    new FormField(
      'Address',
      'addressGroup',
      'Address',
      'group',
      [],
      false,
      null,
      null,
      [
        new FormField(
          'Street Address',
          'street',
          'Street Address',
          'text',
          [],
          true,
          2,
          100,
          [],
          'street',
          []
        ),
        new FormField(
          'Country',
          'country',
          'Country',
          'text',
          [],
          true,
          2,
          100,
          [],
          'country',
          []
        ),
      ]
    ),
    new FormField(
      'Phone',
      'phone',
      'Phone',
      'number',
      [],
      true,
      2,
      10,
      [],
      'age',
      []
    ),
    new FormField(
      'message',
      'message',
      'message',
      'text',
      [],
      true,
      2,
      10,
      [],
      'message',
      []
    ),
    new FormField(
      'Educationm',
      'educationroup',
      'Education',
      'group',
      [],
      false,
      null,
      null,
      [
        new FormField(
          'Education',
          'education',
          'Education',
          'text',
          [],
          false,
          2,
          100,
          [],
          '',
          []
        ),
        new FormField(
          '',
          'country',
          'Country',
          'text',
          [],
          false,
          2,
          100,
          [],
          'country',
          []
        ),
      ]
    ),
  ];

  dynamicForm!: FormGroup;

  @ViewChild(ComponentHostDirective, { static: true })
  dynamicHost!: ComponentHostDirective;

  private componentMap: Record<string, any> = {
    text: TextInputComponent,
    password: TextInputComponent,
    number: TextInputComponent,
    select: SelectBoxComponent,
    radio: RadioComponent,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.dynamicForm = this.createForm(this.formFields);
    this.loadDynamicComponents();
  }

  createForm(fields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};
    fields.forEach((field) => {
      if (field.type === 'group' && field.nestedFields?.length) {
        group[field.key] = this.createForm(field.nestedFields);
      } else {
        const validators = this.makeValidators(field);
        group[field.key] = this.fb.control('', validators);
      }
    });
    return this.fb.group(group);
  }

  makeValidators(field: FormField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.required) validators.push(Validators.required);
    if (field.minLength) validators.push(Validators.minLength(field.minLength));
    if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
    return validators;
  }

  loadDynamicComponents(fields: FormField[] = this.formFields, parentKey = '') {
    const viewContainerRef = this.dynamicHost.viewContainerRef;
    fields.forEach((field) => {
      const fieldKey = parentKey ? `${parentKey}.${field.key}` : field.key;
      if (field.type === 'group' && field.nestedFields?.length) {
        this.loadDynamicComponents(field.nestedFields, fieldKey);
      } else {
        const componentType = this.componentMap[field.type];
        if (componentType) {
          const componentRef = viewContainerRef.createComponent(componentType);
          (componentRef.instance as any).field = field;
          (componentRef.instance as any).formControl =
            this.dynamicForm.get(fieldKey);
        }
      }
    });
  }

  onSubmit() {
    console.log(this.dynamicForm.value);
  }
}
