package fr.fullstack.shopapp.service;

import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Service;
import fr.fullstack.shopapp.model.OpeningHoursShop;

@Service
public class OpeningHoursService {

    public boolean hasOverlappingHours(List<OpeningHoursShop> openingHours) {
        for (int i = 0; i < openingHours.size(); i++) {
            OpeningHoursShop current = openingHours.get(i);
            for (int j = i + 1; j < openingHours.size(); j++) {
                OpeningHoursShop next = openingHours.get(j);
                // verification si les horaires se chevauchent pour le meme jour
                if (current.getDay() == next.getDay()) {
                    if (isOverlap(current, next)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean isOverlap(OpeningHoursShop first, OpeningHoursShop second) {
        int firstOpenMinutes = convertToMinutes(first.getOpenAt());
        int firstCloseMinutes = convertToMinutes(first.getCloseAt());
        int secondOpenMinutes = convertToMinutes(second.getOpenAt());
        int secondCloseMinutes = convertToMinutes(second.getCloseAt());
    
        // verification si les horaires se chevauchent
        return !(firstCloseMinutes <= secondOpenMinutes || secondCloseMinutes <= firstOpenMinutes);
    }
    

    // convertit l'heure en minutes
    private int convertToMinutes(LocalTime time) {
        return time.getHour() * 60 + time.getMinute();
    }
}
