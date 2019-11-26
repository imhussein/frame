import axios, { AxiosPromise, AxiosResponse } from "axios";

interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

type Callback = () => void;

export class User {
  events: { [event: string]: Callback[] } = {};
  constructor(private data: UserProps) {}

  get(propName): string | number {
    return this.data[propName];
  }

  set(update: UserProps): void {
    Object.assign(this.data, update);
  }

  on(eventName: string, callback: Callback): void {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }

  trigger(eventName: string) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(
        callback: Function,
        index: number
      ) {
        callback();
      });
    }
  }

  fetch(): void {
    axios
      .get(`http://localhost:3000/users/${this.get("id")}`)
      .then((res: AxiosResponse) => {
        this.set(res.data);
      });
  }

  save(): void {
    if (this.get("id")) {
      axios
        .put(`http://localhost:3000/users/${this.get("id")}`, this.data)
        .then((res: AxiosResponse) => {
          console.log(res);
        })
        .catch((err: Error) => {
          console.log(err);
        });
    } else {
      axios.post(`http://localhost:3000/users`, this.data);
    }
  }
}
