package com.cinebook.backend.modules.rooms.service;

import com.cinebook.backend.modules.cinemas.entity.Cinema;
import com.cinebook.backend.modules.cinemas.repository.CinemaRepository;
import com.cinebook.backend.modules.rooms.dto.RoomRequest;
import com.cinebook.backend.modules.rooms.dto.RoomDto;
import com.cinebook.backend.modules.rooms.entity.Room;
import com.cinebook.backend.modules.rooms.entity.Seat;
import com.cinebook.backend.modules.rooms.entity.SeatType;
import com.cinebook.backend.modules.rooms.repository.RoomRepository;
import com.cinebook.backend.modules.rooms.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final CinemaRepository cinemaRepository;

    @Transactional(readOnly = true)
    public Page<RoomDto> getAllRooms(Pageable pageable) {
        return roomRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public RoomDto getRoomById(Long id) {
        return roomRepository.findById(id).map(this::mapToDto)
            .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    private RoomDto mapToDto(Room room) {
        return RoomDto.builder()
                .roomId(room.getRoomId())
                .cinemaId(room.getCinema().getCinemaId())
                .cinemaName(room.getCinema().getName())
                .name(room.getName())
                .rows(room.getRows())
                .columns(room.getColumns())
                .capacity(room.getCapacity())
                .baseNormalPrice(room.getBaseNormalPrice())
                .status(room.getStatus())
                .build();
    }

    @Transactional
    public RoomDto createRoom(RoomRequest request) {
        Cinema cinema = cinemaRepository.findById(request.getCinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found"));

        Integer capacity = request.getRows() * request.getColumns();

        Room room = Room.builder()
                .cinema(cinema)
                .name(request.getName())
                .rows(request.getRows())
                .columns(request.getColumns())
                .capacity(capacity)
                .baseNormalPrice(request.getBaseNormalPrice())
                .build();
        
        room = roomRepository.save(room);

        List<Seat> seats = new ArrayList<>();
        for (int i = 0; i < request.getRows(); i++) {
            char rowChar = (char) ('A' + i);
            String rowLabel = String.valueOf(rowChar);
            for (int j = 1; j <= request.getColumns(); j++) {
                String seatLabel = rowLabel + j;
                Seat seat = Seat.builder()
                        .room(room)
                        .rowLabel(rowLabel)
                        .colNumber(j)
                        .seatLabel(seatLabel)
                        .seatType(SeatType.Normal) // Default to normal
                        .build();
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);

        return mapToDto(room);
    }
}
