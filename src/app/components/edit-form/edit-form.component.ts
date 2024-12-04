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

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ComponentHostDirective,
  ],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.scss',
})
export class EditFormComponent {
  form!: FormGroup;
  formData: FormField[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.dataService.getFormData().subscribe((data: FormField[]) => {
      this.formData = data;
      console.log('FormFeilds data in the edit component', this.formData);
      setTimeout(() => {
        this.loadData();
      }, 1000);
    });
  }

  loadData() {
    this.dataService.getSubmittedFormData().subscribe((data: any) => {
      this.form.patchValue(data);
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
        group[field.key] = new FormControl(null);
      }
    });

    return this.fb.group(group);
  }

  createFormGroup(fields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};

    fields.forEach((field) => {
      group[field.key] = new FormControl(null);
    });

    return this.fb.group(group);
  }

  getFormArray(key: string): FormArray {
    return this.form.get(key) as FormArray;
  }
  onSubmit() {
    console.log('form is ::', this.form.value);
    this.dataService.formDataSubmit(this.form.value);
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
}
