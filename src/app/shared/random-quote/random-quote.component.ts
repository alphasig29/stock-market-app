import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-random-quote',
  templateUrl: './random-quote.component.html',
  styleUrls: ['./random-quote.component.css']
})
export class RandomQuoteComponent implements OnInit {
  currentQuote: string = "";

  private quoteArray: string[] = [
    "I wish I could buy Facebook stock with my Farmville money.",
    "I'm much more comfortable putting my money into fottbal bets than into thte stock market.",
    "Buy low, sell high, sleep 16 hours a day.",
    "The NASDAQ index indicated that you were a poor investment of both time and money.",
    "I'm not sure if I'm trading better, or the market stopped going down.",
    "The stock market is less volatile than most romantic relationships.",
    "I want to have just enough money to be able to decide for myself if money solves everything.",
    "Money talks... but all it says to most of us is 'Hello' and 'Good-bye'.",
    "I hate to spend money, but the economy needs me.",
    "In this type of economy I try to invest like Warren Buffett but usually just drink like Himmy Buffett.",
    "You need to do that thing tht rich people do, where they turn money into more money.",
    "I hope my Facebook stock earns me enough money to make up for the job I lost for constantly being on Facebook.",
    "My advice is to invest in Tennis Balls, they have a high rate of return.",
    "The market may be bad, but I slept like a baby last night. I woke up every hour and cried.",
    "If you feel like doubling up a profitable position, slam your dialing finger in the drawer until the feeling goes away.",
    "If your strategy seems to be working well, you haven't been using it long enough.",
    "Economists have predicted 14 of the last 3 recessions.",
    "Is all my money gone?  No, of course not. It's just with somebody else!",
    "Silence is golden, and gold is up these days, so silence is a solid investment.",
    "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong."
  ];

  constructor() { }

  ngOnInit(): void {
    this.currentQuote = this.quoteArray[Math.floor(Math.random() * this.quoteArray.length)];
  }

}
