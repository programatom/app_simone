export interface ObjRespuestaServidor {
  status:string,
  data:any,
  message:string
};

export interface ObjLocalStorage{
  token:string
}


export interface ObjEntrega{
  entregas:any,
  pedido:any,
  productos:any,
  usuario:any,
  rol:any
}

export interface ObjProcesamientoEntrega{
  entrega_id:number,
  pedido_id:number,
  data:DataProcesamiento
}

export interface DataProcesamiento{

  derivada:number,
  reintentar:number,
  adelanta:number,
  estado:string,
  entregas_adelantadas:number,
  paga_con?:number,
  monto_a_pagar?:number,
  productos_entregados?:Array<{
    id:number,
    cantidad:number,
    precio:number,
  }>
  observaciones:string
}
