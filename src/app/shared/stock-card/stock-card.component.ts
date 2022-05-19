import { Component, Input, OnInit } from '@angular/core';
import { StockQuote } from '../models/stock-quote.model';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.css'],
  animations: [
    trigger('cardFlip', [
      state('default', style({
        transform: 'none'
      })),
      state('flipped', style({
        transform: 'rotateY(180deg)'
      })),
      transition('default => flipped', [
        animate('200ms')
      ]),
      transition('flipped => default', [
        animate('200ms')
      ])
    ])
  ]
})
export class StockCardComponent implements OnInit {
  // stockQuote: StockQuote = new StockQuote('Cons Disc', 'XLY', 175.70, -0.45, -0.26, 175.96, 179.78, 179.48, 176.78);
  @Input() stockQuote: StockQuote;
  flipCardState: string = 'default';

  constructor() { }

  ngOnInit(): void {

  }

  cardClicked() {
    if (this.flipCardState === "default") {
      this.flipCardState = "flipped";
    } else {
      this.flipCardState = "default";
    }

  }
}
