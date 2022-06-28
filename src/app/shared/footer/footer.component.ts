import { Component, Input, OnInit } from '@angular/core';
import { faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
