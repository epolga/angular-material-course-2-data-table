import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Lesson} from '../model/lesson';
import {BehaviorSubject, Observable} from 'rxjs';
import {CoursesService} from './courses.service';
import {catchError} from 'rxjs/operators';
import { of } from 'rxjs';
export class LessonsDataSourse implements DataSource<Lesson> {

  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);

  constructor(private coursesService: CoursesService) {
  }

  loadLessons(courseId: number,
              filter: string,
              sortDirection: string,
              pageIndex: number,
              pageSize: number) {
    this.coursesService.findLessons(courseId, filter, sortDirection,
      pageIndex, pageSize).pipe(
            catchError(() => of([]))
    )
      .subscribe(lessons => this.lessonsSubject.next(lessons));
  }

  connect(collectionViewer: CollectionViewer): Observable<Lesson[]> {
    return this.lessonsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.lessonsSubject.complete();
  }

}
