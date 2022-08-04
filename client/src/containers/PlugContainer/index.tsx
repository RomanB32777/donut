import { useEffect, useState } from 'react';
import './styles.sass'

const PlugContainer = () => {

    const [time, setTime] = useState<any>('')
    
    let end_date = {
        "full_year": "2023", // Год
        "month": "08", // Номер месяца
        "day": "01", // День
        "hours": "00", // Час
        "minutes": "00", // Минуты
        "seconds": "00" // Секунды
    }
    let end_date_str = `${end_date.full_year}-${end_date.month}-${end_date.day}T${end_date.hours}:${end_date.minutes}:${end_date.seconds}`;

    function diffSubtract(date1: any, date2: any) {
        return date2 - date1;
    }

    useEffect( () => {
        const timer = setInterval(function () {
            let timer_show = document.getElementById("timer")
            // Получение времени сейчас
            let now = new Date();
            // Получение заданного времени
            let date = new Date(end_date_str);
            // Вычисление разницы времени 
            let ms_left = diffSubtract(now, date);
            // Если разница времени меньше или равна нулю 
            if (ms_left <= 0) { // То
                // Выключаем интервал
                // Выводим сообщение об окончание
            } else { // Иначе
                // Получаем время зависимую от разницы
                let res = new Date(ms_left);
                // Делаем строку для вывода
                console.log(res)
                let str_timer = `${res.getUTCDate() - 1} days,  ${res.getUTCHours()}:${res.getUTCMinutes()}:${res.getUTCSeconds()}`;
                // Выводим время
                setTime(str_timer)
            }
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])


    return (
        <div
            className='plug-container'
        >
            <span>
                Coming soon
            </span>
            <div id='timer'>
                {
                    time
                }
            </div>
        </div>
    )
}

export default PlugContainer