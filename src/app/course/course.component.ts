import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, timeout} from 'rxjs/operators';
import {merge, fromEvent} from "rxjs";
import {MatTableDataSource} from '@angular/material/table';
import {LessonsDataSourse} from '../services/lessons.datasourse';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course: Course;

    dataSource: LessonsDataSourse;

    displayedColumns = ['seqNo', 'description', 'duration'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {

        this.course = this.route.snapshot.data['course'];
        this.dataSource = new LessonsDataSourse(this.coursesService);
        this.dataSource.loadLessons(this.course.id, '', 'asc', 0, 3);
    }

  searchLessons(query) {

  }

    ngAfterViewInit() {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      merge(this.sort.sortChange.pipe(tap(() => console.log('sorting'))), this.paginator.page).
      pipe(
        tap(() =>
          this.dataSource.loadLessons(this.course.id, '', this.sort.direction,
            this.paginator.pageIndex, this.paginator.pageSize) )
      )
      .subscribe();
    }


}
