import {
  Component,
  ContentChildren,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon } from '../shared/icon-definition';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('sform') searchForm!: NgForm;
  public collapsed: boolean = true;
  public sort: boolean = false;
  public icon = new Icon();
  public alcoholic: boolean = true;
  public nonAlcoholic: boolean = true;
  public disabledAlcoholic: boolean = false;
  public disabledNonAlcoholic: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  private navigateByFragment(fragment: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      fragment: fragment,
    });
  }

  public onHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      this.router.navigate(['/cocktails/home'], {
        relativeTo: this.route,
        queryParams: { search: '??' },
      });
    }, 1);
  }

  public onSubmit() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });

    if (this.searchForm.valid) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: this.searchForm.value.search },
      });
      this.searchForm.reset();
    }
  }
  public onRandom() {
    this.navigateByFragment('random');
  }

  public onSort() {
    if (!this.sort) {
      this.navigateByFragment('sort-up');
    } else {
      this.navigateByFragment('sort-down');
    }
    this.sort = !this.sort;
  }

  public onAlcoholicCheck(
    alcoholic: boolean | null,
    nonAlcoholic: boolean | null
  ): void {
    if (this.alcoholic !== this.nonAlcoholic) {
      this.navigateByFragment('show-all');
      this.alcoholic = this.nonAlcoholic = true;
      this.disabledAlcoholic = this.disabledNonAlcoholic = false;
    } else if (this.alcoholic === this.nonAlcoholic) {
      if (alcoholic) {
        this.navigateByFragment('hide-alcoholic');
        this.alcoholic = false;
        this.disabledNonAlcoholic = true;
      } else if (nonAlcoholic) {
        this.navigateByFragment('hide-nonAlcoholic');
        this.nonAlcoholic = false;
        this.disabledAlcoholic = true;
      }
    }
  }
}
