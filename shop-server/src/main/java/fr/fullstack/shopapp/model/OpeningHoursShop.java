package fr.fullstack.shopapp.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

@Entity
@Table(name = "openingHours")
public class OpeningHoursShop {
    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "Heure de clôture ne peut pas être nulle")
    private LocalTime closeAt;

    @Column(nullable = false)
    @NotNull(message = "Le jour ne peut pas être nulle")
    @Min(value = 1, message = "Vous devrez au moins avoir une journée")
    @Max(value = 7, message = "Nombre de jour ne doit pas être supérieure à 7")
    private int day;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "Heure d'ouverture ne peut pas être nulle")
    private LocalTime openAt;

    public LocalTime getCloseAt() {
        return closeAt;
    }

    public long getDay() {
        return day;
    }

    public long getId() {
        return id;
    }

    public LocalTime getOpenAt() {
        return openAt;
    }

    public void setCloseAt(LocalTime closeAt) {
        this.closeAt = closeAt;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setOpenAt(LocalTime openAt) {
        this.openAt = openAt;
    }
}
