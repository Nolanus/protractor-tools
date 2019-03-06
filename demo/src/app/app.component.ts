import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import fillText from './filltext';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'protractor-tools demo';

  public windowSize: {width: number, height: number} = {width: 0, height: 0};
  public viewportSize: {width: number, height: number} = {width: 0, height: 0};
  public isVisible = true;
  public toggleTriggered = false;

  public fillText = fillText;
  public fillers = [0];

  public shelf = [];

  constructor(@Inject(DOCUMENT) document: Document) {
    this.setSizes(document.defaultView);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSizes(event.target);
  }

  ngOnInit(): void {
  }

  public logSomething() {
    console.log('Hey there console!');
  }

  public logAWarning() {
    console.warn('Ouch... that was close');
  }

  public logAnError() {
    console.error('Houston we\'ve got a problem...');
  }

  public randomToggleVisibility() {
    this.toggleTriggered = true;
    setTimeout(() => {
        this.isVisible = !this.isVisible;
        this.toggleTriggered = false;
      },
      Math.random() * 6000
    );
  }

  public extendContent() {
    this.fillers.push(0);
  }

  public allocateMemory() {
    for (let i = 0; i < 25; ++i) {
      this.shelf.push(new Array(1000000).join('*'));
    }
  }

  public freeShelf() {
    this.shelf.length = 0;
  }

  private setSizes(window: Window) {
    this.windowSize.height = window.outerHeight;
    this.windowSize.width = window.outerWidth;
    this.viewportSize.height = window.innerHeight;
    this.viewportSize.width = window.innerWidth;
  }
}
