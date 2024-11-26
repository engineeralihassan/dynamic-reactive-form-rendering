import { Component, ViewChild, OnInit, ViewContainerRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
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
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentHostDirective,
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @ViewChild('formArrayButtonsHost', { read: ViewContainerRef, static: true })
  formArrayHost!: ViewContainerRef;
  formFields: FormField[] = [
    new FormField('', 'date', 'Date', 'date', [], true, null, null, []),
    new FormField(
      '',
      'location',
      'Specify the location of the accident/incident',
      'text'
    ),
    new FormField('', 'time', 'Time', 'time'),
    new FormField(
      '',
      'picture',
      'Please upload picture of the location',
      'file'
    ),
    new FormField('', 'light', 'Light Conditions', 'radio', [
      'Natural',
      'Lights Work',
      'Artificial',
      'Lights do not work',
    ]),
    new FormField('', 'weather', 'Weather conditions', 'text'),
    new FormField('', 'cause', 'Cause/reason of injury', 'text'),
    new FormField('', 'injury', 'Type of injury & body area affected', 'text'),
    new FormField('', 'details', 'Accident/incident details', 'text'),
    new FormField(
      '',
      'firstAid',
      'Was any First-aid treatment given',
      'radio',
      ['Yes', 'No']
    ),
    new FormField('', 'firstAider', 'If yes, Name of the First-aider', 'text'),
    new FormField(
      '',
      'firstAidDesc',
      'Brief description of the First-aid',
      'text'
    ),
    new FormField(
      '',
      'emergency',
      'Was the emergency service called',
      'radio',
      ['Yes', 'No']
    ),
    new FormField('', 'emergencyDetails', 'If yes, Which one(s)', 'text'),

    new FormField('', 'injuryType', 'Select injury type', 'select', [
      'Sprain',
      'Fracture',
      'Burn',
    ]),

    new FormField(
      '',
      'injurySymptoms',
      'Select symptoms',
      'multi-select',
      ['Swelling', 'Pain', 'Bruising'],
      true
    ),

    new FormField('', 'isSevere', 'Checkbox', 'checkbox', [], true),

    new FormField('', 'affectedAreas', 'Multi-checkbox', 'multi-checkbox', [
      'Arm',
      'Leg',
      'Head',
    ]),

    new FormField(
      'Person involved',
      'personInvolved',
      '',
      'group',
      [],
      true,
      0,
      0,
      [
        new FormField('', 'name', 'Name in full', 'text', [], true),
        new FormField(
          '',
          'gender',
          'Gender',
          'select',
          ['Male', 'Female'],
          true
        ),
        new FormField('', 'age', 'Age', 'number', [], true),
        new FormField('', 'address', 'Address', 'text', [], true),
        new FormField('', 'postcode', 'Postcode', 'text', [], true),
        new FormField('', 'telephone', 'Telephone Number', 'text', [], true),
        new FormField('', 'email', 'Email Address', 'email', [], true),
      ]
    ),
    new FormField(
      'Accident / incident recorded by',
      'accidentRecordedBy',
      '',
      'group',
      [],
      true,
      0,
      0,
      [
        new FormField('', 'recorderName', 'Name in full', 'text', [], true),
        new FormField('', 'jobTitle', 'Job title', 'text', [], true),
        new FormField('', 'date', 'Date', 'date', [], true),
      ]
    ),
    new FormField(
      'Accident / incident recorded by',
      'references-new',
      '',
      'group',
      [],
      true,
      0,
      0,
      [
        new FormField('', 'recorderName', 'Name in full', 'text', [], true),
        new FormField('', 'jobTitle', 'Job title', 'text', [], true),
        new FormField('', 'date', 'Date', 'date', [], true),
      ]
    ),
    new FormField(
      'Accident / incident recorded by',
      'references-new-new',
      '',
      'group',
      [],
      true,
      0,
      0,
      [
        new FormField('', 'recorderName', 'Name in full', 'text', [], true),
        new FormField('', 'jobTitle', 'Job title', 'text', [], true),
        new FormField('', 'date', 'Date', 'date', [], true),
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
  addGroupToFormArray(arrayName: string, nestedFields: FormField[]) {
    const formArray = this.dynamicForm.get(arrayName) as FormArray;
    formArray.push(this.createGroupFromNestedFields(nestedFields));
  }

  removeGroupFromFormArray(arrayName: string, index: number) {
    const formArray = this.dynamicForm.get(arrayName) as FormArray;
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
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
        group[field.key] = this.fb.control('', validators);
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
    alert('submitted');
    console.log(this.dynamicForm.value);
  }
}
