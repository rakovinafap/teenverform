import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Select from 'react-select';

import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Textarea from '@mui/joy/Textarea';

import ReplyIcon from '@mui/icons-material/Reply';





import logo from './logo.png'; 
import logo2 from './logo2.png'; 


const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    gorod: '',
    sklad: '',
    index: '',
    comment: '',
    order: window.location.pathname,
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const myURL = "https://script.google.com/macros/s/AKfycbzNEFlxoPdxW1Q_yOwn1Z-ou8nU9htCengEDbJDvg3OuZqd8cUSzpHJbQsNWtedaPBi/exec"


  const [errors, setErrors] = useState({ surname: false, name: false, phone: false, gorod: false, sklad: false, index: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, surname, phone, order, gorod, sklad, index, comment } = formData;


    // Проверка на пустое значение фамилии
  if (surname.trim() === '') {
    setErrors((prevErrors) => ({
      ...prevErrors,
      surname: true,
    }));
    return;
  } else {
    setErrors((prevErrors) => ({
      ...prevErrors,
      surname: false,
    }));
  }

  // Проверка на пустое значение имени
  if (name.trim() === '') {
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: true,
    }));
    return;
  } else {
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: false,
    }));
  }

  // Проверка на пустое значение номера телефона
  if (phone.length < 10) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: true,
    }));
    return;
  } else {
    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: false,
    }));
  }

  // Проверка адресса
  if (deliverySelected === "НП") {
    if (gorod.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        gorod: true,
      }));
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        gorod: false,
      }));
    }

    if (sklad.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sklad: true,
      }));
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sklad: false,
      }));
    }
  } else {
    if (index.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        index: true,
      }));
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        index: false,
      }));
    }
  }

    let numberSklad = "";
    if (sklad) {
      const regex = /№(\d+)/g;
      const match = regex.exec(sklad);
      numberSklad = match ? match[1]: "1"; 
    } 

    if (index) {
      numberSklad = index;
    }

    let price = localStorage.getItem('price'); // Получаем значение из localStorage

    if (!price || Number(price) <= 0) {
      price = 0; 
    }
    
    const url = `${myURL}?
    &name=${name + " " + surname}&phone=${phone}&order=${order}&gorod=${gorod}&sklad=${numberSklad}&comment=${comment}&price=${price}`;
    

    console.log(url)
    fetch(url)
      .then((response) => {
        console.log('Данные успешно отправлены');
        // TO DO: redirect to thank-you page
      })
      .catch((error) => {
        console.error('Ошибка отправки данных:', error);
      });
      setSuccessPage(true);
  };

  const defaultCities = [
    { value: 'Київ', label: 'Київ', deliveryRefCity: '8d5a980d-391c-11dd-90d9-001a92567626' },
    { value: 'Дніпро', label: 'Дніпро', deliveryRefCity: 'db5c88f0-391c-11dd-90d9-001a92567626' },
    { value: 'Запоріжжя', label: 'Запоріжжя', deliveryRefCity: 'db5c88c6-391c-11dd-90d9-001a92567626' },
    { value: 'Львів', label: 'Львів', deliveryRefCity: 'db5c88f5-391c-11dd-90d9-001a92567626' },
    { value: 'Одеса', label: 'Одеса', deliveryRefCity: 'db5c88d0-391c-11dd-90d9-001a92567626' },
    { value: 'Харків', label: 'Харків', deliveryRefCity: 'db5c88e0-391c-11dd-90d9-001a92567626' },
  ];

  const [warehouses, setWarehouses] = useState([]);
  const [options, setOptions] = useState([...defaultCities]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [deliveryRefCity, setDeliveryRefCity] = useState(null);

  const [deliverySelected, setDeliverySelected] = useState(null);
  const [successPage, setSuccessPage] = useState(false);

  

  

  const fetchDataCity = async (cityName) => {
    
    try {
      const API_KEY = '27a3a0c3ff4bcd2644a88464f1246e41';
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: API_KEY,
          modelName: 'Address',
          calledMethod: 'searchSettlements',
          methodProperties: {
            CityName: cityName,
            limit: '50',
            page: '1',
            
          },
        }),
      });

    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

     
      const cities = data.data[0]?.Addresses.map((address) => ({
        value: address.Present,
        label: address.Present,
        deliveryRefCity: address.DeliveryCity,
      }));
      
      setOptions(cities);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const fetchWarehouses = async (cityRef) => {
    
    try {
      const API_KEY = '27a3a0c3ff4bcd2644a88464f1246e41';
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: API_KEY,
          modelName: 'Address',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityRef: cityRef,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setWarehouses(data.data);
      console.log(data.data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleCityInputChange = async (newValue) => {
    setSelectedOption(null); // Очистить выбранный город перед выбором нового
    if (newValue) {
      setDeliveryRefCity(newValue.deliveryRefCity);
      setWarehouses([]); // Очистить список отделений перед загрузкой новых при выборе города
      await fetchWarehouses(newValue.deliveryRefCity); // Получение отделений при выборе нового города
      setFormData({
        ...formData,
        gorod: newValue.value,
      });
    } else {
      setDeliveryRefCity(null);
      setWarehouses([]); // Сброс списка отделений, если город не выбран
      setFormData({
        ...formData,
        gorod: '',
      });
    }
    setSelectedOption(newValue);
  };

  const handleWarehouseInputChange = (selectedOption) => {
    // Обработка выбора отделения
    if (selectedOption && selectedOption.value) {
      setFormData({
        ...formData,
        sklad: selectedOption.value,
      });
    };
  };

  const loadCityOptions = (inputValue) => {
    fetchDataCity(inputValue);
  };

  const handleSelectDelivery = (value) => {
    setDeliverySelected(value)
  }

  const handleInputPriceChange = (event) => {
    const value = event.target.value;
    localStorage.setItem('price', value); // Сохраняем значение в localStorage
  };

  const handleBackButton = () => {
    setDeliverySelected(false);
  }

  let nameVithApostrof = "Ім'я";
  let nameField = "";



  return (
    <Box width="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column" minHeight="50vh">
      
       <Box style={{display: "flex", width: "100%", textAlign: "center", marginBottom: "20px", justifyContent: "center", alignItems: "center"}}>
       <img
            src={logo2}
            alt="Логотип"
            style={{marginTop: "5px", position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', maxWidth: '400px', height: "100px", width: "100%"}} 
          
        />
       </Box>
      
       {!successPage ? (
        <Box maxWidth="400px" width="100%" style={{marginTop: "100px"}}>

        {!deliverySelected ? (
          <Box textAlign="center" mb={1}>

          <Box style={{ marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Typography variant='h1' mb={1}>Вкажіть, будь-ласка, яку суму сплатили</Typography>
            <Input
              type="number"
              name="predoplata"
              style={{ width: "150px", textAlign: "center" }}
              value={formData.price}
              onChange={handleInputPriceChange}
           />
          </Box>

          <Typography variant='h1' mb={-3}>Оберіть якою поштою бажаєте отримати замовлення?</Typography><br/>
          <div style={{display: 'table' }}>
            <Button
            onClick={() => handleSelectDelivery("НП")} 
            sx={{
              margin: '10px',
              display: 'inline-block',
              width: '200px',
              textAlign: 'center',
              background: "#E76841",
              /* background: "#e45149", */
              '&:hover': {
                background: '#ff4a13', // Цвет кнопки при наведении
              },
            }}
            >
              <p style={{ margin: '5px 0' }}>НОВА ПОШТА</p>
              <p style={{ margin: '5px 0', fontSize: '12px' }}>Накладним або повна оплата</p>
            </Button>
            <Button onClick={() => handleSelectDelivery("УП")} 
            sx={{
              margin: '10px',
              display: 'inline-block',
              width: '200px',
              textAlign: 'center',
              background: "#ffb339",
              /* background: "#e45149", */
              '&:hover': {
                background: '#dd931b', // Цвет кнопки при наведении
              },
            }}
            >
              <p style={{ margin: '5px 0' }}>УКР ПОШТА</p>
              <p style={{ margin: '5px 0', fontSize: '12px' }}>Тільки після повної оплати</p>
            </Button>
            <br/>
           
          </div>
        </Box>
        ): null}

        {deliverySelected ?  
        <form onSubmit={handleSubmit} style={{marginLeft: "5px", marginRight: "5px"}}>
        
        <div 
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between"
        }}
        >
          <div style={{marginRight: "10px"}} >
            <Button variant="outlined">
              <ReplyIcon onClick={() => handleBackButton()}/>
            </Button>
          </div>
         <div>
            <Typography variant='h1' component="body1" style={{fontSize: "20px", textAlign: "center", marginBottom: "20px"}}>Для замовлення заповніть дані</Typography>
          </div>
        </div>

        <div style={{marginBottom: "10px"}}>
        <Typography variant='body1' component="label">
          Прізвище
        </Typography>
          <Input
            type="text"
            id="nameInput"
            name="surname"
            placeholder='Введіть прізвище'
            value={formData.surname}
            onChange={handleChange}
            error={errors.surname}
          />
         {errors.surname && <p style={{ color: 'red', fontSize: "10px", margin: "0px" }}>Інформація не заповнена</p>}
        </div>
        <div style={{marginBottom: "10px"}}>
        <Typography variant='body1' component="label">
         Ім'я
        </Typography>
          <Input
            type="text"
            id="nameInput"
            name="name"
            placeholder={nameVithApostrof}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          {errors.name && <p style={{ color: 'red', fontSize: "10px", margin: "0px" }}>Інформація не заповнена</p>}
        </div>
        <div style={{marginBottom: "20px"}}>
        <Typography variant='body1' component="label">
          Номер телефону
        </Typography>
          <Input
            type="number"
            id="phoneInput"
            name="phone"
            placeholder='380'
            minLength="10"
            maxLength="10"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
           {errors.phone && <p style={{ color: 'red', fontSize: "10px", margin: "0px" }}>Номер телефону повинен починатися з нуля та містити 10 символів</p>}
        </div>

        {deliverySelected === "УП" ? (
          <div>
           <Typography variant='body1' component="label">
          Індекс Укр-Пошти
        </Typography>
          <Input
            type="number"
            id="phoneInput"
            name="index"
            placeholder='Введіть індекс'
            value={formData.index}
            onChange={handleChange}
          />
          {errors.index && <p style={{ color: 'red', fontSize: "10px", margin: "0px" }}>Індекс не вказано</p>}
        </div>
        ) : <div>
         <Typography variant='body1' component="label">
        Місто та відділення (або поштомат)
        </Typography>
        <Select
          value={selectedOption}
          options={options}
          onChange={handleCityInputChange} // Обработчик для выбора города
          onInputChange={loadCityOptions}
          placeholder="Обрати місто"
          noOptionsMessage={() => "Немає варіантів"}
          style={{ margin: '0px' }}
        />
        {errors.gorod && <p style={{ color: 'red', fontSize: "10px", margin: "0px" }}>Місто не обрано</p>}
        <div style={{marginBottom: "5px"}}></div>
        <Select
          options={warehouses.map((warehouse) => ({
            value: warehouse.Description,
            label: warehouse.Description,
          }))}
          onChange={handleWarehouseInputChange} // Обработчик для выбора отделения
          placeholder="Обрати відділення"
          noOptionsMessage={() => "Немає варіантів"}
        />
        {errors.sklad && <p style={{ color: 'red', fontSize: "10px", margin: "0px" }}>Відділення не обрано</p>}
      </div>
      }
      <br/>

        <Typography variant='body1' component="label">
        Коментар до замовлення
        </Typography>
        <Textarea
        name='comment'
        id='comment'  
        value={formData.comment} 
        onChange={handleChange} 
        minRows={2} 
        />

        <Box textAlign="center" mb={3} style={{marginTop: "20px"}}>
            <Button color="success" variant="solid" type="submit">Відправити</Button>
        </Box>
        </form> : null}
        
        </Box>
       ): <p>Замовлення сформовано. Дякуємо!</p>}
    </Box>
  );
};

const GoogleForm = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormComponent />} />
        <Route path="/*" element={<FormComponent />} />
      </Routes>
    </Router>
  );
};

export default GoogleForm;
