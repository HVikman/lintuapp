import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { linnut } from './lajit';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { kunnat } from './kunnat';
import { Havainto } from './havainto.model';
import { DatePipe } from '@angular/common';
import { HavainnotService } from './havainnot.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-havainto',
  templateUrl: './havainto.component.html',
  styleUrls: ['./havainto.component.css'],
  providers: [DatePipe],
})
export class HavaintoComponent implements OnInit {
  myControl = new FormControl('');
  myControl2 = new FormControl('');
  isLoading = false;
  filteredOptions: Observable<string[]> | undefined;
  filteredOptions2: Observable<string[]> | undefined;
  options: string[] = linnut;
  step = 0;
  kunnat: string[] = kunnat;
  filteredVariables!: string[];
  havaintoform = new FormGroup({
    laji: new FormControl(''),
  });
  date = new Date();

  constructor(
    public datepipe: DatePipe,
    public HavainnotService: HavainnotService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter2(value || ''))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private _filter2(value: string): string[] {
    const filterValue2 = value.toLowerCase();

    return this.kunnat.filter((option2) =>
      option2.toLowerCase().includes(filterValue2)
    );
  }

  onNewHavainto(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const date = this.datepipe.transform(form.value.date, 'dd.MM.yyyy');
    const havainto: Havainto = {
      id: null,
      laji: this.myControl.value,
      maara: form.value.maara,
      paikkakunta: this.myControl2.value,
      date: date,
      info: form.value.info,
      osoite: form.value.osoite,
    };
    this.HavainnotService.addHavainto(havainto);
    //testi
    console.log(havainto);
    //
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
