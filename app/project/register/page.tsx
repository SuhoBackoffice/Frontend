'use client';

import { withAuth } from '@/lib/hooks/withAuth';

function ProjectRegister() {
  return (
    <div>
      <h1>프로젝트 등록 페이지</h1>
      <p>이곳은 관리자(admin)와 스태프(staff)만 접근할 수 있습니다.</p>
    </div>
  );
}

export default withAuth(ProjectRegister, ['admin', '관리자']);
