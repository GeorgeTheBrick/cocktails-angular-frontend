import {Component, Input} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";

@Component({
  selector: 'cocktail-detail-modal',
  templateUrl: 'cocktail-detail-modal.component.html',
  styleUrls: ['cocktail-detail-modal.component.css'],
})
export class CocktailDetailModalComponent {
  @Input() public botResponse$!: Subject<string>;
  @Input() public isBotLoading$!: BehaviorSubject<boolean>;
  @Input() public errorObject!: string | null;
}
