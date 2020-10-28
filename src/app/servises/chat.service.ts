import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

export class ChatService {
    private url = '45.83.43.173:3000';
    private socket;
    constructor() {
        this.socket = io(this.url);
    }
    /** STUDENT API */
    /* ticket-history */
    public requestTicketHistory(student_id) {
        this.socket.emit('ticket-history', student_id);
    }
    public getTicketHistory = () => {
        return Observable.create((observer) => {
            this.socket.on('ticket-history', (message) => {
                observer.next(message);
            });
        });
    }
    /* messages-history */
    public requestMessagesHistory( ticket_id ) {
        this.socket.emit('messages_history', ticket_id );
    }
    public getMessagesHistory = () => {
        return Observable.create((observer) => {
            this.socket.on('messages_history', (message) => {
                observer.next(message);
            });
        });
    }

    /** MESSAGE API */
    public sendMessage(message) {
        this.socket.emit('new-message', message);
    }
    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }
    public requestHistory(message) {
        this.socket.emit('get-history', message);
    }
    public getHistory = () => {
        return Observable.create((observer) => {
            this.socket.on('get-history', (message) => {
                observer.next(message);
            });
        });
    }


}