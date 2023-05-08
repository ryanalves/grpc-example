import { Component, OnInit } from '@angular/core';
import { PersonService } from './person.service';
import { Person } from './types/person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sisdist-grpc-front';

  persons: Person[] = [];

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService
      .getPersons()
      .subscribe((persons) => {
        console.log(persons);
        
        if (persons) this.persons = persons;
      });

    this.personService.getPerson().subscribe((person) => {
      let idx = this.persons.findIndex((p) => p.id === person.id);
      if (idx === -1) {
        this.persons.push(person);
      } else {
        this.persons[idx] = person;
      }
    });
  }
}
