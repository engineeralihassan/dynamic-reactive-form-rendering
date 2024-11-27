export class FormField {
  constructor(
    public title: string,
    public key: string,
    public name: string,
    public label: string,
    public type: string,
    public options?: string[],
    public required: boolean = false,
    public minLength?: number | null,
    public maxLength?: number | null,

    public nestedFields: FormField[] = [],
    public id?: string | null,
    public validators: string[] = []
  ) {}
}
