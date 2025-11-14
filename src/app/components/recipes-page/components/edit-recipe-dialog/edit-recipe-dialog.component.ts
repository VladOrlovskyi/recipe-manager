import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormArray,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-recipe-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './edit-recipe-dialog.component.html',
  styleUrl: './edit-recipe-dialog.component.scss',
})
export class EditRecipeDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  editForm!: FormGroup;
  newTagControl = new FormControl('', { nonNullable: true });
  newMealTypeControl = new FormControl('', { nonNullable: true });
  newIngredientControl = new FormControl('', { nonNullable: true });
  newInstructionControl = new FormControl('', { nonNullable: true });

  constructor(
    public dialogRef: MatDialogRef<EditRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.data.name, Validators.required],
      cuisine: [this.data.cuisine, Validators.required],
      image: [this.data.image, Validators.required],
      difficulty: [this.data.difficulty, Validators.required],
      prepTimeMinutes: [
        this.data.prepTimeMinutes,
        [Validators.required, Validators.min(1)],
      ],
      cookTimeMinutes: [
        this.data.cookTimeMinutes,
        [Validators.required, Validators.min(1)],
      ],
      servings: [this.data.servings, [Validators.required, Validators.min(1)]],
      caloriesPerServing: [
        this.data.caloriesPerServing,
        [Validators.required, Validators.min(1)],
      ],
      userId: [this.data.userId, [Validators.required, Validators.min(1)]],
      rating: [
        this.data.rating,
        [Validators.required, Validators.min(0), Validators.max(5)],
      ],
      reviewCount: [
        this.data.reviewCount,
        [Validators.required, Validators.min(1)],
      ],
      tags: this.fb.array(
        this.data.tags.map((tag: string) =>
          this.fb.control(tag, Validators.required)
        )
      ),
      mealType: this.fb.array(
        this.data.mealType.map((type: string) =>
          this.fb.control(type, Validators.required)
        )
      ),
      ingredients: this.fb.array(
        this.data.ingredients.map((ing: string) =>
          this.fb.control(ing, Validators.required)
        ),
        Validators.required
      ),
      instructions: this.fb.array(
        this.data.instructions.map((step: string) =>
          this.fb.control(step, Validators.required)
        ),
        Validators.required
      ),
    });
  }

  get tagsArray(): FormArray {
    return this.editForm.get('tags') as FormArray;
  }

  get mealTypeArray(): FormArray {
    return this.editForm.get('mealType') as FormArray;
  }

  get ingredientsArray(): FormArray {
    return this.editForm.get('ingredients') as FormArray;
  }

  get instructionsArray(): FormArray {
    return this.editForm.get('instructions') as FormArray;
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updatedRecipe = {
        ...this.data,
        ...formValue,
      };
      this.dialogRef.close(updatedRecipe);
    }
  }

  addTag(): void {
    const newTagValue = this.newTagControl.value.trim();
    const tagsValues = this.tagsArray.controls.map((control) =>
      control.value.toLowerCase()
    );

    if (
      newTagValue &&
      newTagValue.length > 0 &&
      !tagsValues.includes(newTagValue.toLowerCase())
    ) {
      this.tagsArray.push(this.fb.control(newTagValue, Validators.required));
      this.newTagControl.reset('');
    }
  }

  addMealType(): void {
    const newTypeValue = this.newMealTypeControl.value.trim();
    const currentTypes: string[] = this.mealTypeArray.value.map(
      (t: string | null) => (t || '').toLowerCase()
    );

    if (
      newTypeValue &&
      newTypeValue.length > 0 &&
      !currentTypes.includes(newTypeValue.toLowerCase())
    ) {
      this.mealTypeArray.push(
        this.fb.control(newTypeValue, Validators.required)
      );
      this.newMealTypeControl.reset('');
    }
  }

  addIngredient(): void {
    this.ingredientsArray.push(this.fb.control('', Validators.required));
  }

  addInstruction(): void {
    const newInstructionValue = this.newInstructionControl.value.trim();
    const valueToAdd = newInstructionValue.length > 0 ? newInstructionValue : '';
    this.instructionsArray.push(this.fb.control(valueToAdd, Validators.required));
    this.newInstructionControl.reset(''); 
  }

  removeTag(index: number): void {
    this.tagsArray.removeAt(index);
  }

  removeMealType(index: number): void {
    this.mealTypeArray.removeAt(index);
  }

  removeIngredient(index: number): void {
    this.ingredientsArray.removeAt(index);
    this.ingredientsArray.updateValueAndValidity();
  }

  removeInstruction(index: number): void {
    this.instructionsArray.removeAt(index);
    this.instructionsArray.updateValueAndValidity();
  }
}
