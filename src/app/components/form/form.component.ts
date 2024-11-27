import { Component, ViewChild, OnInit, ViewContainerRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ValidatorFn,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ComponentHostDirective } from '../../directives/component-host.directive';
import { FormField } from '../../models/form-field.model';
import { TextInputComponent } from '../text-input/text-input.component';
import { SelectBoxComponent } from '../select-box/select-box.component';
import { RadioComponent } from '../radio/radio.component';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ComponentHostDirective,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @ViewChild(ComponentHostDirective, { static: true })
  dynamicHost!: ComponentHostDirective;
  isDataLoading: boolean = true;

  dynamicForm!: FormGroup;
  formFields: FormField[] = [];

  private componentMap: Record<string, any> = {
    text: TextInputComponent,
    password: TextInputComponent,
    number: TextInputComponent,
    time: TextInputComponent,
    checkbox: CheckboxComponent,
    date: TextInputComponent,
    file: TextInputComponent,
    select: SelectBoxComponent,
    radio: RadioComponent,
  };

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // this.formFields = this.dataService.formData;
  }

  ngOnInit() {
    this.dataService.getFormData().subscribe((data: FormField[]) => {
      this.formFields = data;
      this.dynamicForm = this.createForm(data);
      this.loadDynamicComponents();
      this.isDataLoading = false;
    });
    // this.dynamicForm = this.createForm(this.formFields);
    // this.loadDynamicComponents();
  }

  createForm(fields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};
    fields.forEach((field) => {
      if (field.type === 'group' && field.nestedFields?.length) {
        group[field.key] = this.fb.array([
          this.createGroupFromNestedFields(field.nestedFields),
        ]);
      } else {
        const validators = this.makeValidators(field);
        if (field.type === 'checkbox') {
          group[field.key] = this.fb.control(false, validators);
        } else {
          group[field.key] = this.fb.control('', validators);
        }
      }
    });
    return this.fb.group(group);
  }

  createGroupFromNestedFields(fields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};
    fields.forEach((field) => {
      const validators = this.makeValidators(field);
      group[field.key] = this.fb.control('', validators);
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
        const formArray = this.dynamicForm.get(fieldKey) as FormArray;
        formArray.controls.forEach((groupControl: any, index: any) => {
          const nestedKey = `${fieldKey}[${index}]`;
          this.loadDynamicComponents(field.nestedFields, nestedKey);
        });
      } else {
        const componentType =
          this.componentMap[field.type] || TextInputComponent; // Default to TextInputComponent
        const componentRef = viewContainerRef.createComponent(componentType);
        (componentRef.instance as any).field = field;
        (componentRef.instance as any).formControl =
          this.dynamicForm.get(fieldKey);
      }
    });
  }

  onSubmit() {
    console.log(this.dynamicForm.value);
  }
}
