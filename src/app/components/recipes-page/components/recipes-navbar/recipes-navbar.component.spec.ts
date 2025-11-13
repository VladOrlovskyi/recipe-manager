import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesNavbarComponent } from './recipes-navbar.component';

describe('RecipesNavbarComponent', () => {
  let component: RecipesNavbarComponent;
  let fixture: ComponentFixture<RecipesNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
