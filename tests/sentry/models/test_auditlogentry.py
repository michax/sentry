from django.utils import timezone

from sentry.models import AuditLogEntry, AuditLogEntryEvent, AuditLogEvent, audit_log_manager
from sentry.testutils import TestCase


class AuditLogEntryTest(TestCase):
    def test_plan_changed(self):
        entry = AuditLogEntry.objects.create(
            organization=self.organization,
            event=AuditLogEntryEvent.PLAN_CHANGED,
            actor=self.user,
            datetime=timezone.now(),
            data={"plan_name": "Team"},
        )

        assert entry.get_note() == "changed plan to Team"

    def test_plan_changed_with_quotas(self):
        entry = AuditLogEntry.objects.create(
            organization=self.organization,
            event=AuditLogEntryEvent.PLAN_CHANGED,
            actor=self.user,
            datetime=timezone.now(),
            data={
                "plan_name": "Team",
                "quotas": "50K errors, 100K transactions, and 1 GB of attachments",
            },
        )

        assert (
            entry.get_note()
            == "changed plan to Team with 50K errors, 100K transactions, and 1 GB of attachments"
        )


class AuditLogEventManagerTest(TestCase):
    def test_audit_log_manager(self):
        self.data = {"email": "my_email@gmail.com"}
        log_event = AuditLogEvent(
            event_id=1,
            name="member_invite",
            api_name="member.invite",
            get_note="invited member {}".format(self.data["email"]),
        )

        audit_log_manager.add(log_event)

        assert audit_log_manager.get(event_id=1) == log_event
        assert audit_log_manager.get_event_id(name="member_invite") == 1
        assert audit_log_manager.get_api_names() == ["member.invite"]
