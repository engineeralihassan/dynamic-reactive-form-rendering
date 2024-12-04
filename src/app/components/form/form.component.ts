import {
  Component,
  ViewChild,
  OnInit,
  ViewContainerRef,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
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
import { ButtonComponent } from '../button/button.component';
import { fromArrayLike } from 'rxjs/internal/observable/innerFrom';
import { F } from '@angular/cdk/keycodes';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ComponentHostDirective,
    RouterModule,
    RouterLink,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  formData: FormField[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.dataService.getFormData().subscribe((data: FormField[]) => {
      this.formData = data;
    });
  }

  ngOnInit() {
    this.form = this.createForm(this.formData);
  }

  createForm(fields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};

    fields.forEach((field) => {
      if (field.type === 'group') {
        group[field.key] = this.fb.array([
          this.createFormGroup(field.nestedFields),
        ]);
      } else {
        group[field.key] = new FormControl('', this.generateValidators(field));
      }
    });

    return this.fb.group(group);
  }

  generateValidators(field: FormField): ValidatorFn[] {
    const fieldValidators: ValidatorFn[] = [];
    if (field.required) {
      fieldValidators.push(Validators.required);
    }
    if (field.minLength) {
      fieldValidators.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      fieldValidators.push(Validators.maxLength(field.maxLength));
    }
    field.validators.forEach((pattern) => {
      const regexValidator = Validators.pattern(pattern);
      fieldValidators.push(regexValidator);
    });

    return fieldValidators;
  }

  createFormGroup(fields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};

    fields.forEach((field) => {
      group[field.key] = new FormControl('', this.generateValidators(field));
    });

    return this.fb.group(group);
  }

  getFormArray(key: string): FormArray {
    return this.form.get(key) as FormArray;
  }
  onSubmit() {
    this.dataService.formDataSubmit(this.form.value);
    console.log('FormFeilds value', this.form.value);
  }

  addGroup(field: FormField): void {
    const formArray = this.getFormArray(field.key);

    const newGroup = this.fb.group({});
    field.nestedFields.forEach((nestedField) => {
      newGroup.addControl(
        nestedField.key,
        new FormControl('', nestedField.required ? Validators.required : null)
      );
    });
    formArray.push(newGroup);
  }

  removeGroup(fieldKey: string, index: number): void {
    const formArray = this.getFormArray(fieldKey);
    formArray.removeAt(index);
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.errors?.['required']) {
        return 'This field is required.';
      }
      if (control.errors?.['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters.`;
      }
      if (control.errors?.['maxlength']) {
        return `Maximum length is ${control.errors['maxlength'].requiredLength} characters.`;
      }
      if (control.errors?.['pattern']) {
        return 'Invalid format.';
      }
    }
    return null;
  }
}
