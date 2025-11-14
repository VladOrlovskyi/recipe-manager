import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipeDialogComponent } from './edit-recipe-dialog.component';

describe('EditRecipeDialogComponent', () => {
  let component: EditRecipeDialogComponent;
  let fixture: ComponentFixture<EditRecipeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecipeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRecipeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
