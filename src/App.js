/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import './App.css';
// import { useDispatch, useSelector } from "react-redux";


const App = () => {

  const [cad, setCad] = useState('0');

  //Calculadora
  const Cualculadora = () => {

    //Display  
    const Display = () => {
      return (
         <div id='display' className='display'><p>{cad}</p></div>
      )
    }

    //Teclado
    const Teclado = () => {

      const esSigno = (x) => ( x === '+' || x === '-' || x === 'x' || x === '/');
      const esLetra = (x) => ( x !== '.' && !esSigno(x));
      //Tecla
      const Tecla = ( props ) => {

        function limpia( cadena ) {

          let i = cadena.length - 1;
          while (!esLetra(cadena[i])) {
            i--;
          }
          if (i < cadena.length - 1) {
            return cadena.substring(0,i+1).toString() ;
          } 
          return cadena;
        }

        function primerNumero(cadena,index) {
          if (index === cadena.length - 1)
          return {
            num: cadena.substring(index,index+1),
            index:index
          }
          for (let i = index+1; i < cadena.length; i++) {
            if ( esSigno(cadena[i]) || i === cadena.length - 1) {
              if ( i === cadena.length - 1 ) 
              return {
                num: cadena.substring(index,i+1),
                index:i
              }
              return {
                num: cadena.substring(index,i),
                index:i
              }
            }
          }             
        }

        //esta funcion suma una cadena
        function resuelve(cadena) {

          const y = cadena;

          const indexInCad = (index, str) => (index > 0 && index < str.length); 

          const cadenaAux = limpia(cadena);
          
          let numeros = [];
          let signos = [];
          let finish = false
          
          while (!finish) {

            const {num,index} = primerNumero(cadena,0);
            numeros.push(parseFloat( num ));

            if ( indexInCad(index + 1, cadena)) {
               signos.push(cadena[index]);
               cadena = cadena.substring(index+1);
            }
            else {
              finish = true
            };
          }

          //multiplicar y dividir
          let i = 0;
          while ( i < signos.length ) {
            if ( signos[i] === 'x' || signos[i] === '/' ) {
              let res = 0;
              if (signos[i] === 'x') res = numeros[i]*numeros[i+1]; else res = Math.trunc( 10000*(numeros[i]/numeros[i+1]) )/10000;
              //TODO: ojo con division por cero
              numeros[i] = res;
              numeros.splice(i+1,1);
              signos.splice(i,1);
            }   
            else i++;
          }
          //sumar y restar
          i=0;
          while ( i < signos.length ) {
            if ( signos[i] === '+' || signos[i] === '-' ) {
              let res = 0;
              if (signos[i] === '+') res = numeros[i]+numeros[i+1]; else res = numeros[i]-numeros[i+1];
              //TODO: ojo con division por cero
              numeros[i] = res;
              numeros.splice(i+1,1);
              signos.splice(i,1);
            }   
            else i++;
          }

          if (numeros[0] === Infinity) return 'Error';
          return numeros[0].toString();
         }

          


        const input = ( letra ) => {

          //Borrando el numero
          if (letra === 'AC') { 
            setCad('0');
            return;
          }


          //no deben haber dos ceros delante
          if (cad.length === 1 && cad[0] === '0' && letra === '0') return;

          //no deben haber dos puntos
          if (letra === '.' && cad.indexOf('.') !== -1) return; 

          //el primer signo no puede ser + * /
          if (cad.length === 0 && letra !== '-' && esSigno(letra)) return;


          //Dos signos iguales seguidos no puede ser
          if (cad.length > 1 && esSigno(letra) && letra === cad[ cad.length - 1 ] ) return;

          //Despues de . no puede ir un signo
          if (cad.length > 0 && cad[ cad.length - 1] === '.' && esSigno(letra)) {
            return;
          }
          
          
          //Si el ultimo es un signo y la letra es un signo
          if (cad.length > 1 && esSigno(letra) && esSigno( cad[cad.length - 1])) { 

            //si hay tres signos pon solo el utltimo signo
            if ( cad.length > 2 && esSigno(letra) && esSigno( cad[cad.length - 1]) && esSigno( cad[cad.length - 2] ) ) {
              setCad( cad.substring( 0,cad.length - 2) + letra );
              return;
            }

            //si antes habia un signo y vino - dejalo pasar 
            if ( letra === '-') {
              //agregar el signo - despues del signo anterior
              setCad( cad + letra);
              return;
            }

            //quitar el ultimo signo y poner el nuevo
            setCad( cad.substring( 0,cad.length - 1) + letra );
            return;
          }
          
          //Signo igual 
          if ( letra === '=') { 
            //si no  hay numero no hace nada
            if (!cad.length > 0) return;

            // quitar los ultimos signos o .
            setCad( limpia(cad) )

            //halla la solucion
            setCad ( resuelve( cad ));
            return;
          }

          // si la cadena no es muy larga suma caracter
          if (cad.length < 15 ) 
          {

            if (cad.length === 1 && cad[0] === '0' ) {
              if (letra === '/' || letra === 'x' || letra === '+' ) return;
              //si empieza con cero y no es +/x empieza con letra
              setCad(letra);
              return;
            }
            setCad( cad + letra);
          }
          
        }

        return (
           <div id={props.id} onClick={() => input(props.letra)}  className={"tecla " + props.clase}>{props.letra}</div>
        )
      }

      return (
         <div className='teclado'>
            <Tecla id="clear" clase="centrar ac" letra="AC"/>
            <Tecla id="divide" clase="centrar dividir" letra="/"/>
            <Tecla id="multiply" clase="centrar multiplicar" letra="x"/>
            <Tecla id="seven" clase="centrar siete" letra="7"/>
            <Tecla id="eight" clase="centrar ocho" letra="8"/>
            <Tecla id="nine" clase="centrar nueve" letra="9"/>
            <Tecla id="subtract" clase="centrar menos" letra="-"/>
            <Tecla id="four" clase="centrar cuatro" letra="4"/>
            <Tecla id="five" clase="centrar cinco" letra="5"/>
            <Tecla id="six" clase="centrar seis" letra="6"/>
            <Tecla id="add" clase="centrar suma" letra="+"/>
            <Tecla id="one" clase="centrar uno" letra="1"/>
            <Tecla id="two" clase="centrar dos" letra="2"/>
            <Tecla id="three" clase="centrar tres" letra="3"/>
            <Tecla id="zero" clase="centrar cero" letra="0"/>
            <Tecla id="decimal" clase="centrar coma" letra="."/>
            <Tecla id="equals" clase="centrar igual" letra="="/>
         </div>
      )
    }

    return (
      <div className='calculadora'>
        <Display/>
        <Teclado/>
     </div>
    )
  }

  return (
    <div className='contenedor'>
      <Cualculadora/>
    </div>
  )
}

export default App;






