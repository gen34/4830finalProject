import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-circle',
  templateUrl: './app-circle.component.html',
  styleUrls: ['./app-circle.component.css']
})
export class AppCircleComponent implements OnInit {

  constructor() { 
    console.log("app circle component constructor, random:" + Math.random());
  }

  ngOnInit() {
  }

}
