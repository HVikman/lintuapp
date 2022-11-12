import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import { Havainto } from '../havainto.model';
import { HavainnotService } from '../havainnot.service';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ExcelService } from './excel.service';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Component({
  selector: 'app-kaikki',
  templateUrl: './kaikki.component.html',
  styleUrls: ['./kaikki.component.css'],
})
export class KaikkiComponent implements OnInit, OnDestroy {
  title = 'Lintuapp';
  aika = new Date();
  fileName = 'Havainnot_' + this.aika.toLocaleDateString() + ').xlsx';
  private havainnotSub: Subscription = new Subscription();
  havainnot: Havainto[];
  importHavainnot: Havainto[] = [];
  isLoading: boolean;

  constructor(
    public HavainnotService: HavainnotService,
    private _formBuilder: FormBuilder,
    private ExcelService: ExcelService
  ) {}
  ngOnDestroy(): void {
    this.havainnotSub.unsubscribe();
  }

  ngOnInit(): void {
    this.HavainnotService.getAllHavainnot();
    this.havainnotSub = this.HavainnotService.getHavaintoUpdateListener().subscribe(
      (havainnot: Havainto[]) => {
        this.havainnot = havainnot;
      }
    );
    this.isLoading = false;
  }

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    var data = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(data, this.fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    fs.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const data = <any[]>this.ExcelService.importFromFile(bstr);

      const header: string[] = [
        'maara',
        'laji',
        'date',
        'paikkakunta',
        'osoite',
        'info',
      ];

      const importedData = data.slice(1);

      console.log('imported Data:' + importedData);
      this.importHavainnot = importedData.map((arr) => {
        const obj = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return <Havainto>obj;
      });
      console.log(this.importHavainnot);
    };
    reader.readAsBinaryString(target.files[0]);
  }
  excelTietokantaan() {
    for (let i = 0; i < this.importHavainnot.length; i++) {
      this.HavainnotService.addHavainto(this.importHavainnot[i]);
    }
    alert('Havainnot tallennettu');
  }
  excelPeruuta() {
    this.importHavainnot = [];
  }
}
