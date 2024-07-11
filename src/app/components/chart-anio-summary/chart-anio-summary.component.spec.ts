import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAnioSummaryComponent } from './chart-anio-summary.component';

describe('ChartAnioSummaryComponent', () => {
  let component: ChartAnioSummaryComponent;
  let fixture: ComponentFixture<ChartAnioSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartAnioSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAnioSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
