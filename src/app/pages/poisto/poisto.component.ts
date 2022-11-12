import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HavainnotService } from '../havainto/havainnot.service';

@Component({
  templateUrl: './poisto.component.html',
})
export class PoistoComponent {
  constructor(
    public HavainnotService: HavainnotService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onDelete() {
    this.HavainnotService.deletePost(this.data);
  }
}
