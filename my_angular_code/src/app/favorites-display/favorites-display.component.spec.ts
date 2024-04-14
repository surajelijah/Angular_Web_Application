import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesDisplayComponent } from './favorites-display.component';

describe('FavoritesDisplayComponent', () => {
  let component: FavoritesDisplayComponent;
  let fixture: ComponentFixture<FavoritesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
