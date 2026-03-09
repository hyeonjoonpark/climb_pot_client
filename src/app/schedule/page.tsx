"use client";

import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Schedule } from "@/types/schedule";
import {
  MOCK_SCHEDULES,
  CURRENT_USER_ID,
  getParticipantNames,
  getNonParticipantNames,
} from "@/lib/mock/schedule";

function dateToStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function SchedulePage() {
  const today = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [schedules, setSchedules] = useState<Schedule[]>(() => [...MOCK_SCHEDULES]);
  const [showForm, setShowForm] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: today,
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  });

  const datesWithSchedulesSet = useMemo(
    () => new Set(schedules.map((s) => s.date)),
    [schedules]
  );
  const selectedDateSchedules = useMemo(
    () =>
      schedules
        .filter((s) => s.date === selectedDate)
        .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")),
    [schedules, selectedDate]
  );

  const handleJoin = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? { ...s, participantIds: [...s.participantIds, CURRENT_USER_ID] }
          : s
      )
    );
  };
  const handleLeave = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? { ...s, participantIds: s.participantIds.filter((id) => id !== CURRENT_USER_ID) }
          : s
      )
    );
  };

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newSchedule: Schedule = {
      id: `sc${Date.now()}`,
      title: form.title,
      description: form.description || undefined,
      date: form.date,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      location: form.location || undefined,
      creatorId: CURRENT_USER_ID,
      creatorName: "클라이머A",
      participantIds: [CURRENT_USER_ID],
      createdAt: new Date().toISOString().slice(0, 19),
    };
    setSchedules((prev) => [...prev, newSchedule]);
    setForm({
      title: "",
      date: selectedDate,
      startTime: "",
      endTime: "",
      location: "",
      description: "",
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#191f28]">일정</h1>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-white hover:bg-burgundy-hover"
          >
            일정 등록
          </button>
        </div>

        <div className="schedule-calendar-wrapper mt-8">
          <Calendar
            locale="ko-KR"
            value={new Date(selectedDate + "T12:00:00")}
            onChange={(value) => {
              const d = value instanceof Date ? value : value?.[0];
              if (d) setSelectedDate(dateToStr(d));
            }}
            tileClassName={({ date }) => {
              const str = dateToStr(date);
              return datesWithSchedulesSet.has(str) ? "has-event" : "";
            }}
            tileContent={({ date }) => {
              const str = dateToStr(date);
              if (!datesWithSchedulesSet.has(str)) return null;
              const isSelected = str === selectedDate;
              return (
                <span
                  className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                    isSelected ? "bg-white" : "bg-burgundy"
                  }`}
                />
              );
            }}
            prev2Label={null}
            next2Label={null}
            className="w-full rounded-2xl border border-[#e5e8eb] bg-white p-4 shadow-sm"
          />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-[#191f28]">
            {formatDateLabel(selectedDate)} 일정
          </h2>
          {selectedDateSchedules.length === 0 ? (
            <p className="mt-4 text-sm text-[#8b95a1]">
              이 날 등록된 일정이 없습니다.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {selectedDateSchedules.map((schedule) => {
                const isJoined = schedule.participantIds.includes(CURRENT_USER_ID);
                return (
                  <li
                    key={schedule.id}
                    className="rounded-xl border border-[#e5e8eb] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedScheduleId(schedule.id)}
                        className="min-w-0 flex-1 text-left hover:opacity-90"
                      >
                        <h3 className="font-medium text-[#191f28]">
                          {schedule.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#4e5968]">
                          {schedule.startTime}
                          {schedule.endTime && ` - ${schedule.endTime}`}
                          {schedule.location && ` · ${schedule.location}`}
                        </p>
                        {schedule.description && (
                          <p className="mt-1 text-sm text-[#8b95a1]">
                            {schedule.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-[#8b95a1]">
                          주최: {schedule.creatorName} · 참여 {schedule.participantIds.length}명 · 클릭하여 참여/불참 인원 보기
                        </p>
                      </button>
                      <div className="flex shrink-0 gap-2" onClick={(e) => e.stopPropagation()}>
                        {isJoined ? (
                          <button
                            type="button"
                            onClick={() => handleLeave(schedule.id)}
                            className="rounded-lg border border-[#e5e8eb] px-3 py-1.5 text-sm font-medium text-[#4e5968] hover:bg-[#f9fafb]"
                          >
                            불참
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleJoin(schedule.id)}
                            className="rounded-lg bg-burgundy px-3 py-1.5 text-sm font-medium text-white hover:bg-burgundy-hover"
                          >
                            참여
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {selectedScheduleId && (() => {
          const schedule = schedules.find((s) => s.id === selectedScheduleId);
          if (!schedule) return null;
          const participantNames = getParticipantNames(schedule.participantIds);
          const nonParticipantNames = getNonParticipantNames(schedule.participantIds);
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              onClick={() => setSelectedScheduleId(null)}
            >
              <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-[#191f28]">
                    {schedule.title} · 참여 현황
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSelectedScheduleId(null)}
                    className="rounded-lg p-1 text-[#4e5968] hover:bg-[#f2f4f6]"
                    aria-label="닫기"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#191f28]">
                      참여인원 ({participantNames.length}명)
                    </h3>
                    {participantNames.length === 0 ? (
                      <p className="mt-1 text-sm text-[#8b95a1]">참여한 인원이 없습니다.</p>
                    ) : (
                      <ul className="mt-1 flex flex-wrap gap-2">
                        {participantNames.map((name) => (
                          <li
                            key={name}
                            className="rounded-full bg-burgundy/10 px-3 py-1 text-sm font-medium text-burgundy"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#191f28]">
                      불참인원 ({nonParticipantNames.length}명)
                    </h3>
                    {nonParticipantNames.length === 0 ? (
                      <p className="mt-1 text-sm text-[#8b95a1]">모두 참여합니다.</p>
                    ) : (
                      <ul className="mt-1 flex flex-wrap gap-2">
                        {nonParticipantNames.map((name) => (
                          <li
                            key={name}
                            className="rounded-full bg-[#f2f4f6] px-3 py-1 text-sm text-[#4e5968]"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedScheduleId(null)}
                    className="rounded-lg border border-[#e5e8eb] px-4 py-2 text-sm font-medium text-[#4e5968] hover:bg-[#f9fafb]"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-[#191f28]">일정 등록</h2>
              <form onSubmit={handleSubmitSchedule} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#191f28]">
                    제목
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="일정 제목"
                    className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#191f28]">
                    날짜
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, date: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#191f28]">
                      시작 시간
                    </label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, startTime: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#191f28]">
                      종료 시간
                    </label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, endTime: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#191f28]">
                    장소
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, location: e.target.value }))
                    }
                    placeholder="장소 (선택)"
                    className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#191f28]">
                    설명
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="설명 (선택)"
                    rows={3}
                    className="mt-1 w-full resize-none rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-burgundy px-4 py-2 text-sm font-medium text-white hover:bg-burgundy-hover"
                  >
                    등록
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-[#e5e8eb] px-4 py-2 text-sm font-medium text-[#4e5968] hover:bg-[#f9fafb]"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
