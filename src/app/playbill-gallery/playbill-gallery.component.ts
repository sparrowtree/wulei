import { Component, OnInit, Input, Inject, ViewChild, ElementRef, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { Post } from '../shared/Post';
import { ConcurrencyService } from '../services/concurrency.service';
import { PictureService } from '../services/picture.service';
import { Picture } from '../shared/picture';

@Component({
  selector: 'app-playbill-gallery',
  providers: [ ConcurrencyService, PictureService ],
  templateUrl: './playbill-gallery.component.html',
  styleUrls: ['./playbill-gallery.component.scss']
})
export class PlaybillGalleryComponent implements OnInit, AfterViewChecked {

  @Input() posts: Post[];

  playbills: Picture[];

  @ViewChild('showableView') showableRef: ElementRef;
  @ViewChild('playbillContainerView') playbillContainerRef: ElementRef;
  
  stepLength: number;
  maxLength: number;

  styleLeft: number = 0;

  @Output() choosePost: EventEmitter<string> = new EventEmitter<string>();

  constructor(private concurrencyService: ConcurrencyService
    , private pictureService: PictureService
    , @Inject('baseURL') private baseURL: string) { }

  ngOnInit() {
    var ids: string[] = [];
    for(let post of this.posts) {
      ids.push(post.playbill);
    }
    
    this.concurrencyService.getMany(this.pictureService, ids)
      .subscribe( playbills => this.playbills = playbills );
  }

  ngAfterViewChecked() {
    this.stepLength = this.showableRef.nativeElement.offsetWidth;
    this.maxLength = this.playbillContainerRef.nativeElement.offsetWidth;
  }

  clickLeft() {
    if(this.styleLeft < this.stepLength) {
      this.styleLeft = 0;
    } else {
      this.styleLeft = this.styleLeft - this.stepLength;
    }
  }

  clickRight() {
    if(this.maxLength - this.styleLeft - this.stepLength < this.stepLength) {
      this.styleLeft = this.maxLength - this.stepLength;
    } else {
      this.styleLeft = this.styleLeft + this.stepLength;
    }
  }

  navigateTo(index: number) {
    this.choosePost.emit( this.posts[index].id );
  }
}
