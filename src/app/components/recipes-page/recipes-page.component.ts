import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RecipesService } from './services/recipes.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RecipesNavbarComponent } from './components/recipes-navbar/recipes-navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { ModalConfirmationDialogComponent } from './components/modal-confirmation-dialog/modal-confirmation-dialog.component';
import { EditRecipeDialogComponent } from './components/edit-recipe-dialog/edit-recipe-dialog.component';

@Component({
  selector: 'app-recipes-page',
  imports: [
    RecipesNavbarComponent,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    RouterOutlet,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.scss',
})
export class RecipesPageComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  dataSource: WritableSignal<any[]> = signal([]);
  displayedColumns: string[] = [
    'Image',
    'Name',
    'Cuisine',
    'Difficulty',
    'Calories',
    'Tags',
    'Actions',
  ];
  isLoading = signal(true);
  pageSizeSignal: WritableSignal<number> = signal(10);
  pageIndexSignal: WritableSignal<number> = signal(0);
  pageSizeOptions: number[] = [10, 25, 50];
  recipesTags: string[] = [];
  searchControl = new FormControl('', { nonNullable: true });
  tagControl = new FormControl('All', { nonNullable: true });

  searchFilter = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300)),
    { initialValue: this.searchControl.value }
  );
  tagFilter = toSignal(this.tagControl.valueChanges, {
    initialValue: this.tagControl.value,
  });

  totalRecipes: WritableSignal<number> = signal(0);
  private paginationChange$ = new Subject<void>();

  totalItems = computed(() =>
    this.totalRecipes() > 0 ? this.totalRecipes() : this.filteredData().length
  );

  filteredData = computed(() => {
    const data = this.dataSource();
    const search = this.searchFilter().toLowerCase().trim();

    return data.filter((recipe) => {
      const matchesSearch =
        !search ||
        recipe.name.toLowerCase().includes(search) ||
        recipe.cuisine.toLowerCase().includes(search);

      return matchesSearch;
    });
  });

  paginatedData = computed(() => {
    const data = this.filteredData();
    const pageSize = this.pageSizeSignal();
    const pageIndex = this.pageIndexSignal();

    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return data.slice(start, end);
  });

  constructor(public recipesService: RecipesService) {
    const filterChanges$ = combineLatest([
      this.tagControl.valueChanges.pipe(startWith(this.tagControl.value)),
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounceTime(300)
      ),
    ]);

    const filterAndPaginationChanges$ = combineLatest([
      filterChanges$,
      this.paginationChange$.pipe(startWith(null)),
    ]).pipe(map(([filterTuple, _]) => filterTuple));

    const apiRequestTrigger$ = filterAndPaginationChanges$.pipe(
      switchMap(([tag, search]) => {
        this.isLoading.set(true);
        const query = search.trim();
        let request$: Observable<any>;
        if (!query && tag === 'All') {
          const limit = this.pageSizeSignal();
          const skip = this.pageIndexSignal() * limit;
          request$ = this.recipesService
            .getRecipesWithPagination(limit, skip)
            .pipe(
              map((res) => ({
                recipes: res.recipes || [],
                total: res.total || 0,
              }))
            );
        } else if (!query && tag !== 'All') {
          this.totalRecipes.set(0);
          request$ = this.recipesService
            .getRecipesByTag(tag)
            .pipe(map((res) => ({ recipes: res.recipes || [], total: 0 })));
        } else if (query && tag === 'All') {
          this.totalRecipes.set(0);
          request$ = this.recipesService
            .searchRecipes(query)
            .pipe(map((res) => ({ recipes: res.recipes || [], total: 0 })));
        } else if (query && tag !== 'All') {
          this.totalRecipes.set(0);
          request$ = this.recipesService.combineTagAndSearch(tag, query).pipe(
            map(([tagResults, searchResults]) => {
              const tagIds = new Set(tagResults.map((r: any) => r.id));
              const combinedRecipes = searchResults.filter((r: any) =>
                tagIds.has(r.id)
              );
              return { recipes: combinedRecipes, total: 0 };
            })
          );
        } else {
          this.totalRecipes.set(0);
          request$ = this.recipesService.getRecipesByTag('All');
        }
        return request$.pipe(
          startWith({ recipes: this.dataSource(), total: this.totalRecipes() })
        );
      })
    );
    const recipesSignal = toSignal(apiRequestTrigger$, {
      initialValue: { recipes: [], total: 0 },
    });

    effect(() => {
      const result = recipesSignal();
      if (result && Array.isArray(result.recipes)) {
        this.dataSource.set(result.recipes);
        if (result.total > 0) {
          this.totalRecipes.set(result.total);
        }

        this.isLoading.set(false);
      }

      if (this.pageIndexSignal() !== 0) {
        this.pageIndexSignal.set(0);
      }
    });
  }

  ngOnInit(): void {
    this.getRecipesTags();
    this.subscribeToRecipeDeletions();
  }

  getRecipesTags() {
    this.recipesService.getRecipesTags().subscribe({
      next: (resTags) => {
        this.recipesTags = resTags;
      },
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSizeSignal.set(event.pageSize);
    this.pageIndexSignal.set(event.pageIndex);
    const query = this.searchControl.value.trim();
    const tag = this.tagControl.value;

    if (!query && tag === 'All') {
      this.paginationChange$.next();
    }
  }

  confirmDeletion(recipeId: number): void {
    const dialogRef = this.dialog.open(ModalConfirmationDialogComponent, {
      width: '400px',
      data: { recipeId: recipeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteRecipeLocally(recipeId);
      }
    });
  }

  deleteRecipeLocally(id: number): void {
    const currentFullData = this.dataSource();

    if (!currentFullData || currentFullData.length === 0) {
      return;
    }

    const updatedRecipes = currentFullData.filter(
      (recipe: any) => recipe.id !== id
    );

    this.dataSource.set(updatedRecipes);

    if (this.totalRecipes() > 0) {
      this.totalRecipes.update((total) => total - 1);
    }

    if (this.paginatedData().length === 0 && this.pageIndexSignal() > 0) {
      this.pageIndexSignal.update((index) => index - 1);
    }
  }

  subscribeToRecipeDeletions(): void {
    this.recipesService.recipeDeleted$.subscribe((deletedId) => {
      this.deleteRecipeLocally(deletedId);
    });
  }

  openEditDialog(recipe: any): void {
    const dialogRef = this.dialog.open(EditRecipeDialogComponent, {
      width: '600px',
      data: recipe,
    });

    dialogRef.afterClosed().subscribe((updatedRecipe: any | undefined) => {
      if (updatedRecipe) {
        this.updateRecipeLocally(updatedRecipe);
      }
    });
  }

  updateRecipeLocally(updatedRecipe: any): void {
    const currentFullData = this.dataSource();

    if (!currentFullData || currentFullData.length === 0) {
      return;
    }

    const updatedData = currentFullData.map((recipe: any) => {
      if (recipe.id === updatedRecipe.id) {
        return updatedRecipe;
      }
      return recipe;
    });
    this.dataSource.set(updatedData);
  }
}
