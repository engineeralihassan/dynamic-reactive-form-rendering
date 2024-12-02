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
  AbstractControl,
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
  dynamicForm!: FormGroup;
  formFields: any[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.dataService.getFormData().subscribe((data: FormField[]) => {
      this.formFields = data;
    });
  }

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({});
    this.formFields.forEach((field) => {
      if (field.type === 'group') {
        this.dynamicForm.addControl(field.key, this.fb.array([]));
      } else {
        this.dynamicForm.addControl(
          field.key,
          this.fb.control('', Validators.required)
        );
      }
    });
  }

  getFormArrayControls(fieldKey: string): AbstractControl[] {
    const formArray = this.dynamicForm?.get(fieldKey) as FormArray;
    return formArray ? formArray.controls : [];
  }

  addGroupToFormArray(fieldKey: string, nestedFields: any[]): void {
    const formArray = this.dynamicForm?.get(fieldKey) as FormArray;
    const group = this.fb.group({});
    nestedFields.forEach((field) => {
      group.addControl(field.key, this.fb.control('', Validators.required));
    });
    formArray.push(group);
  }

  onSubmit(): void {
    if (this.dynamicForm?.valid) {
      console.log(this.dynamicForm?.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
