import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Havainto } from './havainto/havainto.model';
import { HavainnotService } from './havainto/havainnot.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PoistoComponent } from './poisto/poisto.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [DatePipe],
})
export class IndexComponent implements OnInit, OnDestroy {
  private havainnotSub: Subscription = new Subscription();
  private authListenerSubs!: Subscription;
  constructor(
    private authService: AuthService,
    public datepipe: DatePipe,
    public HavainnotService: HavainnotService,
    private dialog: MatDialog
  ) {}
  valinta = 'excel';
  date = new Date();
  selected!: Date;
  selectedFormatted: string | null | undefined;
  havainnot: Havainto[] = [];
  isLoading = false;
  userIsAuthenticated = false;

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.selectedFormatted = this.datepipe.transform(this.date, 'dd.MM.yyyy');
    this.isLoading = true;
    this.HavainnotService.getHavainnot(this.selectedFormatted);
    this.havainnotSub = this.HavainnotService.getHavaintoUpdateListener().subscribe(
      (havainnot: Havainto[]) => {
        this.havainnot = havainnot;
      }
    );
    this.isLoading = false;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  addEvent() {
    // haetaan valitun päivän havainnot tietokannasta, kun päivä vaihtuu
    this.isLoading = true;
    this.havainnot = [];
    this.selectedFormatted = this.datepipe.transform(
      this.selected,
      'dd.MM.yyyy'
    );
    this.HavainnotService.getHavainnot(this.selectedFormatted);

    this.isLoading = false;
  }
  onDelete(postId: string) {
    this.dialog.open(PoistoComponent, { data: postId });
  }

  ngOnDestroy() {
    this.havainnotSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
