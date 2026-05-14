import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadicacionPage } from './radicacion.page';

describe('RadicacionPage', () => {
  let component: RadicacionPage;
  let fixture: ComponentFixture<RadicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
