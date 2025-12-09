CREATE DATABASE agenda_vet;
USE agenda_vet;

CREATE TABLE Pet (
    id_pet INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    idade INT,
    dono VARCHAR(100) NOT NULL
);

CREATE TABLE ConsultaVet (
    id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_pet INT NOT NULL,
    veterinario VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    hora datetime,
    motivo VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pendente',

    CONSTRAINT fk_pet_consulta
        FOREIGN KEY (id_pet)
        REFERENCES Pet(id_pet)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

select * from Pet;
select * from ConsultaVet;

drop database agenda_vet;