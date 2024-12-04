import { Injectable } from '@angular/core';
import { FormField } from '../models/form-field.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  formData: FormField[] = [
    new FormField('', 'date', '', 'Date', 'date', [], true, null, null, []),
    new FormField(
      '',
      'location',
      '',
      'Specify the location of the accident/incident',
      'text'
    ),
    new FormField('', 'time', '', 'Time', 'time'),
    // new FormField(
    //   '',
    //   'picture',
    //   '',
    //   'Please upload picture of the location',
    //   'file'
    // ),
    new FormField('', 'light', '', 'Light Conditions', 'radio', [
      'Natural',
      'Lights Work',
      'Artificial',
      'Lights do not work',
    ]),
    new FormField('', 'weather', '', 'Weather conditions', 'text'),
    new FormField('', 'cause', '', 'Cause/reason of injury', 'text'),
    new FormField(
      '',
      'injury',
      '',
      'Type of injury & body area affected',
      'text'
    ),
    new FormField('', 'details', '', 'Accident/incident details', 'text'),
    new FormField(
      '',
      'firstAid',
      '',
      'Was any First-aid treatment given',
      'radio',
      ['Yes', 'No']
    ),
    new FormField(
      '',
      'firstAider',
      '',
      'If yes, Name of the First-aider',
      'text'
    ),
    new FormField(
      '',
      'firstAidDesc',
      '',
      'Brief description of the First-aid',
      'text'
    ),
    new FormField(
      '',
      'emergency',
      '',
      'Was the emergency service called',
      'radio',
      ['Yes', 'No']
    ),
    new FormField('', 'emergencyDetails', '', 'If yes, Which one(s)', 'text'),

    new FormField('', 'injuryType', '', 'Select injury type', 'select', [
      'Sprain',
      'Fracture',
      'Burn',
    ]),

    new FormField(
      '',
      'injurySymptoms',
      '',
      'Select symptoms',
      'multi-select',
      ['Swelling', 'Pain', 'Bruising'],
      true
    ),

    new FormField('', 'isSevere', '', 'Checkbox', 'checkbox', [], true),

    new FormField('', 'affectedAreas', '', 'Multi-checkbox', 'checkbox', [
      'Arm',
      'Leg',
      'Head',
    ]),

    new FormField(
      'Person involved',
      'personInvolved',
      '',
      '',
      'group',
      [],
      true,
      0,
      0,
      [
        new FormField('', 'name', '', 'Name in full', 'text', [], true),
        new FormField(
          '',
          'gender',
          '',
          'Gender',
          'select',
          ['Male', 'Female'],
          true
        ),
        new FormField('', 'age', '', 'Age', 'number', [], true),
        new FormField('', 'address', '', 'Address', 'text', [], true),
        new FormField('', 'postcode', '', 'Postcode', 'text', [], true),
        new FormField(
          '',
          'telephone',
          '',
          'Telephone Number',
          'text',
          [],
          true
        ),
        new FormField('', 'email', '', 'Email Address', 'email', [], true),
      ]
    ),
    new FormField(
      'Accident / incident recorded by',
      'accidentRecordedBy',
      '',
      '',
      'group',
      [],
      true,
      0,
      0,
      [
        new FormField('', 'recorderName', '', 'Name in full', 'text', [], true),
        new FormField('', 'jobTitle', '', 'Job title', 'text', [], true),
        new FormField('', 'date', '', 'Date', 'date', [], true),
      ]
    ),
  ];
  submittedData: any;

  constructor() {}
  getFormData() {
    return of(this.formData);
  }

  formDataSubmit(formData: any) {
    this.submittedData = formData;
  }
  getSubmittedFormData() {
    return of(this.submittedData);
  }
}
