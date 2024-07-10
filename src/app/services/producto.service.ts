import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IProducto } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductoService extends BaseService<IProducto> {
    protected override source: string = 'productos';
    private productoListSignal = signal<IProducto[]>([]);

    get productos$() {
        return this.productoListSignal;
    }

    getAllSignal() {
        this.findAll().subscribe({
            next: (response: any) => {
                response.reverse();
                this.productoListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching productos', error);
            }
        });
    }

    saveProductoSignal(producto: IProducto): Observable<any>{
        return this.add(producto).pipe(
            tap((response: any) => {
                this.productoListSignal.update( productos => [response, ...productos]);
            }),
            catchError(error => {
                console.error('Error saving producto', error);
                return throwError(error);
            })
        );
    }

    updateProductoSignal(producto: IProducto): Observable<any>{
        return this.edit(producto.id, producto).pipe(
            tap((response: any) => {
                const updatedProductos = this.productoListSignal().map(p => p.id === producto.id ? response : p);
                this.productoListSignal.set(updatedProductos);
            }),
            catchError(error => {
                console.error('Error updating producto', error);
                return throwError(error);
            })
        );
    }

    deleteProductoSignal(producto: IProducto): Observable<any>{
        return this.del(producto.id).pipe(
            tap((response: any) => {
                const updatedProductos = this.productoListSignal().filter(p => p.id !== producto.id);
                this.productoListSignal.set(updatedProductos);
            }),
            catchError(error => {
                console.error('Error deleting producto', error);
                return throwError(error);
            })
        );
    }
}