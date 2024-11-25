import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
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

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ComponentHostDirective,
  ],
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
      'Hobby',
      'hobby',
      'Hobby',
      'radio',
      ['Cricket', 'Gaming', 'Reading'],
      true,
      2,
      10,
      [],
      'hobby',
      ['required']
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
    new FormField(
      'Password',
      'password',
      'Password',
      'group',
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

  @ViewChild(ComponentHostDirective, { static: true })
  dynamicHost!: ComponentHostDirective;

  private componentMap: Record<string, any> = {
    text: TextInputComponent,
    password: TextInputComponent,
    select: SelectBoxComponent,
    radio: RadioComponent,
  };

  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.dynamicForm = this.createForm(this.formFields);
    this.loadDynamicComponents();
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
    const validators: ValidatorFn[] = [];
    if (field.required) validators.push(Validators.required);
    if (field.minLength) validators.push(Validators.minLength(field.minLength));
    if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
    return validators;
  }

  loadDynamicComponents() {
    const viewContainerRef = this.dynamicHost.viewContainerRef;
    viewContainerRef.clear();

    this.formFields.forEach((field) => {
      const componentType = this.componentMap[field.type];
      if (componentType) {
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as any).field = field;
        (componentRef.instance as any).formControl = this.dynamicForm.get(
          field.key
        );
      }
    });
  }

  onSubmit() {
    console.log(this.dynamicForm.value);
    alert('Form Submitted Successfully!');
  }
}
